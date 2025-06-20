import { createEffect, createSignal, For, fr, h, onCleanup, Show } from "@/shared/element-helper/element-helper.js";
import { pathToRegExp } from "./path-to-regexp";

let prevPath = null;
const [path, setPath] = createSignal(location.hash.slice(2));
export function Routes(props) {
  createEffect(() => {
    if (!location.hash.startsWith("#!/")) {
      router.navigateTo("/", { replace: true });
    }
  });
  createEffect(() => {
    window.addEventListener("popstate", handlePopstate);
    onCleanup(() => {
      window.removeEventListener("popstate", handlePopstate);
    });
    function handlePopstate(e) {
      setPath(location.hash.slice(2));
      prevPath = e.state?.prevPath;
    }
  });
  const routes = () =>
    Object.entries(props.routes).map(([path, render]) => ({
      path,
      pattern: pathToRegExp(path),
      render,
    }));
  const matchedPath = () => {
    const currentPath = path();
    for (const route of routes()) {
      if (route.pattern.test(currentPath)) {
        return route.path;
      }
    }
  };
  return fr(
    h(For, {
      each: routes,
      render: (route) =>
        h(Show, {
          when: () => route.path === matchedPath(),
          render: () =>
            route.render({
              params: path().match(route.pattern).groups,
              children: props.children,
            }),
        }),
      resolveKey: (route) => route.path,
    }),
    h(Show, { when: () => matchedPath() == null, render: props.notFound }),
  );
}
export function Link({ children, to, replace, ...attr }) {
  return h(
    "a",
    {
      ...attr,
      href: `#!/${to.replace(/^\//, "")}`,
      onclick: (e) => {
        e.preventDefault();
        const path = e.currentTarget.hash.slice(2);
        router.navigateTo(path, { replace });
      },
    },
    ...children,
  );
}

export const router = {
  navigateTo,
  back,
  reload,
};
/**
 *
 * @param {string} path
 * @param {{ data?: unknown, replace?: boolean, scroll?: boolean }} [options]
 */
function navigateTo(path, options) {
  if (!path.startsWith("/")) throw new Error(`Invalid path: ${path}`);

  const currentPath = location.hash.slice(2);
  if (currentPath === path) return reload();

  const url = `#!${path}`;

  if (options?.replace) {
    history.replaceState({ prevPath, data: options?.data }, "", url);
  } else {
    prevPath = currentPath;
    history.pushState({ prevPath, data: options?.data }, "", url);
  }
  setPath(path);

  if (options?.scroll ?? true) {
    queueMicrotask(() => {
      scrollTo({
        behavior: "instant",
        top: 0,
        left: 0,
      });
    });
  }
}
/**
 *
 * @param {{ data?: unknown, replace?: boolean, scroll?: boolean }} [options]
 */
function back(options) {
  if (prevPath == null) {
    history.back();
  } else {
    navigateTo(prevPath, options);
  }
}
function reload() {
  history.go(0);
}
