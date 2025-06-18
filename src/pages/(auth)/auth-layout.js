import { h } from "@/shared/element-helper/element-helper";
import { Link } from "@/shared/router/router";

export function AuthLayout(props) {
  return h(
    "main",
    { class: "mx-auto" },
    h(
      "h1",
      { class: "mt-25 mb-17.5" },
      h(
        Link,
        { to: "/" },
        h("img", {
          src: `${import.meta.env.BASE_URL}images/hodu-logo.svg`,
          class: "w-59.5 h-18.5 mx-auto",
        }),
      ),
    ),
    h("div", { class: "max-w-137.5 mx-auto" }, ...props.children),
  );
}
