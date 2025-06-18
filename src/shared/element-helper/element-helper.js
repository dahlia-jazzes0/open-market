let owner = null;

/**
 * @template T
 * @param {T} initialValue
 * @returns {[() => T, (x: T | (prevState: T) => T) => void]}
 */
export function createSignal(initialValue) {
  let value = initialValue;
  const subscribers = new Set();
  return [read, write];
  function read() {
    if (owner != null && Object.hasOwn(owner, "dependencies") && owner.dependencies != null) {
      subscribers.add(owner);
      owner.dependencies.add({ subscribers });
    }
    return value;
  }
  function write(newValue) {
    // Use function form for atomic updates
    if (typeof newValue === "function") {
      newValue = newValue(value);
    }
    if (Object.is(value, newValue)) return;
    value = newValue;
    notify();
  }
  function notify() {
    for (const sub of [...subscribers]) {
      queueMicrotask(() => {
        try {
          sub.execute();
        } catch (error) {
          console.error("Error executing subscriber:", error);
        }
      });
    }
  }
}

export function createEffect(fn, options) {
  const effect = {
    __debug_fn: fn.name,
    __debug_type: "effect",
    execute: () => {
      cleanup(effect);
      wrapOwnerContext(effect, fn);
    },
    dependencies: new Set(),
    cleanupFns: [],
    children: new Set(),
    parent: owner,
  };
  if (owner != null) {
    owner.children.add(effect);
  }
  if (options?.sync) {
    effect.execute();
  } else {
    queueMicrotask(() => {
      effect.execute();
    });
  }
}

function createRoot(fn) {
  const root = {
    __debug_fn: fn.name,
    __debug_type: "root",
    dependencies: undefined,
    cleanupFns: [],
    children: new Set(),
    parent: undefined,
  };
  wrapOwnerContext(root, fn, dispose);
  function dispose() {
    cleanup(root, { recursive: true });
  }
}
function createScope(fn) {
  const scope = {
    __debug_fn: fn.name,
    __debug_type: "scope",
    dependencies: undefined,
    cleanupFns: [],
    children: new Set(),
    parent: owner,
  };
  if (owner != null) {
    owner.children.add(scope);
  }
  wrapOwnerContext(scope, fn, dispose);
  function dispose() {
    cleanup(scope, { recursive: true });
  }
}

function cleanup(computation, options) {
  if (options?.recursive) {
    for (const child of computation.children) {
      cleanup(child, options);
      computation.children.delete(child);
    }
    computation.children.clear();
  }
  computation.parent = undefined;

  if (computation.dependencies != null) {
    for (const dep of computation.dependencies) {
      dep.subscribers.delete(computation);
    }
    computation.dependencies.clear();
  }

  for (const cleanupFn of computation.cleanupFns) {
    try {
      cleanupFn();
    } catch (error) {
      console.error("Cleanup function error:", error);
    }
  }
  computation.cleanupFns = [];
}

export function createMemo(fn) {
  const [value, setValue] = createSignal();
  createEffect(
    () => {
      setValue(fn());
    },
    { sync: true },
  );
  return value;
}

export function onCleanup(fn) {
  if (owner != null) {
    owner.cleanupFns.push(fn);
  }
}

export function h(tag, props, ...children) {
  if (typeof tag === "function") return tag({ ...props, children: children.flat() });

  const element = document.createElement(tag);
  if (props) {
    for (const [key, value] of Object.entries(props)) {
      if (typeof value === "function") {
        if (key === "ref") {
          value(element);
        } else if (key.startsWith("on")) {
          element.addEventListener(key.slice(2).toLowerCase(), value);
        } else {
          createEffect(() => setAttribute(key, value()));
        }
      } else {
        setAttribute(key, value);
      }
    }
  }
  for (const child of children.flat()) {
    insert(element, child);
  }
  return element;
  function setAttribute(key, value) {
    if (value == null || value === false) {
      element.removeAttribute(key, value);
    } else {
      element.setAttribute(key, value);
    }
  }
}
const fragmentMarkerMap = new WeakMap();
export function fr(...children) {
  const fragment = document.createDocumentFragment();
  const beginMarker = document.createComment("begin");
  const endMarker = document.createComment("end");
  fragmentMarkerMap.set(fragment, { begin: beginMarker, end: endMarker });
  fragment.append(beginMarker);
  for (const child of children) {
    _insert(fragment, child);
  }
  fragment.append(endMarker);
  return fragment;
}

export function Show({ when, render }) {
  const marker = document.createComment("show");

  let prevDispose;
  let current;
  createEffect(() => {
    const condition = when();
    if (prevDispose != null) {
      prevDispose();
      prevDispose = undefined;
    }

    if (condition) {
      createScope((dispose) => {
        const node = render();
        current = _insert(marker.parentElement, node, marker, current);
        prevDispose = dispose;
      });
    } else {
      current = _insert(marker.parentElement, null, marker, current);
    }
  });
  onCleanup(() => {
    prevDispose?.();
  });

  return marker;
}

export function For({ each, render, resolveKey }) {
  const fr = document.createDocumentFragment();
  const beginMarker = document.createComment("begin");
  const endMarker = document.createComment("end");
  fr.append(beginMarker);
  fr.append(endMarker);
  const map = new Map();
  createEffect(() => {
    const list = each();
    const parent = beginMarker.parentElement;
    if (!parent) return;

    const newKeySet = new Set(list.map(resolveKey ?? ((_, i) => i)));

    for (const [key, old] of map) {
      if (!newKeySet.has(key)) {
        old.dispose();
        old.node.remove();
        map.delete(key);
      }
    }

    const buffer = document.createDocumentFragment();

    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      const key = resolveKey?.(item, i) ?? i;

      const oldItem = map.get(key);
      if (oldItem != null) {
        buffer.append(oldItem.node);
      } else {
        createScope((dispose) => {
          const value = render(item, i, list);
          const node = _insert(buffer, value);
          map.set(key, {
            node,
            dispose,
          });
        });
      }
    }
    insert(parent, buffer, endMarker);
  });

  onCleanup(() => {
    for (const item of map.values()) {
      item.dispose();
      item.node.remove();
    }
    map.clear();
  });
  return fr;
}

export function render(component, targetNode) {
  createRoot(() => {
    targetNode.innerHTML = "";
    targetNode.appendChild(component());
  });
}

function insert(parent, value, marker) {
  if (parent == null) return null;
  if (typeof value === "function") {
    let current;
    createEffect(() => {
      current = _insert(parent, value(), marker, current);
    });
  } else {
    _insert(parent, value, marker);
  }
}

function _insert(parent, value, marker, current) {
  if (value == null || typeof value === "boolean") {
    cleanupNodes(current);
    return null;
  } else if (typeof value === "string" || typeof value === "number") {
    const stringValue = String(value);
    if (current instanceof Text) {
      if (current.data !== stringValue) current.data = stringValue;
      return current;
    }
    cleanupNodes(current);
    const textNode = document.createTextNode(stringValue);
    parent.insertBefore(textNode, marker ?? null);
    return textNode;
  } else if (value instanceof DocumentFragment) {
    cleanupNodes(current);
    const nodes = [...value.childNodes];
    parent.insertBefore(value, marker ?? null);
    return nodes;
  } else if (value instanceof Node) {
    if (current === value) return current;
    cleanupNodes(current);
    parent.insertBefore(value, marker ?? null);
    return value;
  } else if (Array.isArray(value)) {
    return value.map((item) => _insert(parent, item, marker)).flat();
  }
  cleanupNodes(current);
  return null;

  function cleanupNodes(node) {
    if (node == null) return;
    if (Array.isArray(node)) node.forEach(cleanupNodes);
    else if (node instanceof DocumentFragment) {
      throw 53;
    } else if (node instanceof Node) {
      node.remove();
    }
  }
}

function wrapOwnerContext(newOwner, fn, ...args) {
  const prevOwner = owner;
  owner = newOwner;
  try {
    return fn(...args);
  } finally {
    owner = prevOwner;
  }
}
