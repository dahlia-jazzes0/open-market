import { h } from "@/shared/element-helper/element-helper";
import { Link } from "../router/router";
import { SearchInput } from "./search-input";

export function HeaderView() {
  return h(
    "header",
    {
      class: "bg-white relative",
    },
    [
      h("div", { class: "shadow-header absolute top-0 left-0 right-0 bottom-0 pointer-events-none" }),
      h(
        "div",
        {
          class: "h-22.5 xl:w-7xl mx-auto flex justify-between items-center",
        },
        [
          h(
            "div",
            {
              class: "flex items-center gap-x-7.5",
            },
            [
              h("h1", { class: "basis-31 grow-0 shrink-0" }, [
                h(Link, { to: "/" }, [
                  h("img", {
                    src: `${import.meta.env.BASE_URL}images/hodu-logo.svg`,
                    alt: "",
                    class: "w-31 h-9.5",
                  }),
                  h("span", { class: "sr-only" }, ["호두 메인페이지"]),
                ]),
              ]),
              h(SearchInput),
            ],
          ),
          h("nav", {}, [
            h(
              "ul",
              { class: "flex gap-x-6.5" },
              h(
                "li",
                null,
                h(
                  Link,
                  { to: "/shopping-cart", class: "flex flex-col gap-y-1 items-center" },
                  h("img", {
                    class: "w-8 h-8 pr-1",
                    src: `${import.meta.env.BASE_URL}images/icon-shopping-cart.svg`,
                    alt: "",
                  }),
                  h("p", { class: "text-xs text-gray-3 break-keep" }, ["장바구니"]),
                ),
              ),
              h(
                "li",
                null,
                h(
                  Link,
                  { to: "/login", class: "flex flex-col gap-y-1 items-center" },
                  h("img", { class: "w-8 h-8", src: `${import.meta.env.BASE_URL}images/icon-user.svg`, alt: "" }),
                  h("p", { class: "text-xs text-gray-3 break-keep" }, ["로그인"]),
                ),
              ),
            ),
          ]),
        ],
      ),
    ],
  );
}
