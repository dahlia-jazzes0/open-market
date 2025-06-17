import {
  createEffect,
  createMemo,
  createSignal,
  For,
  fr,
  h,
  onCleanup,
  Show,
} from "@/shared/element-helper/element-helper.js";
import { pathToRegExp } from "./path-to-regexp";

const [path, setPath] = createSignal(location.hash.slice(2));
export function Routes(props) {
  createEffect(() => {
    if (!location.hash.startsWith("#!/")) {
      navigateTo("/");
    }
  });
  createEffect(() => {
    window.addEventListener("popstate", handlePopstate);
    onCleanup(() => {
      window.removeEventListener("popstate", handlePopstate);
    });
    function handlePopstate() {
      setPath(location.hash.slice(2));
    }
  });
  const routes = createMemo(() =>
    Object.entries(props.routes).map(([path, render]) => ({
      path,
      pattern: pathToRegExp(path),
      render,
    })),
  );
  const matchedPath = createMemo(() => {
    const currentPath = path();
    for (const route of routes()) {
      if (route.pattern.test(currentPath)) {
        return route.path;
      }
    }
  });
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
export function Link({ children, to, ...attr }) {
  return h(
    "a",
    {
      ...attr,
      href: `#!/${to.replace(/^\//, "")}`,
      onclick: (e) => {
        e.preventDefault();
        const path = e.currentTarget.hash.slice(2);
        navigateTo(path);
      },
    },
    ...children,
  );
}
export function navigateTo(path, options) {
  if (!path.startsWith("/")) throw new Error(`Invalid path: ${path}`);
  history.pushState({ path, options }, "", `#!${path}`);
  setPath(path);
  queueMicrotask(() => {
    scrollTo({
      behavior: "instant",
      top: 0,
      left: 0,
    });
  });
}
