import { h } from "@/shared/element-helper/element-helper";
import { Link } from "../router/router";
import { SearchInput } from "./search-input";

export function HeaderView() {
  return h(
    "header",
    {
      class: "bg-white shadow-header",
    },
    [
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
                    src: "/images/hodu-logo.svg",
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
                  h("img", { class: "w-8 h-8 pr-1", src: "/images/icon-shopping-cart.svg" }),
                  h("p", { class: "text-xs text-gray-3 break-keep" }, ["장바구니"]),
                ),
              ),
              h(
                "li",
                null,
                h(
                  Link,
                  { to: "/login", class: "flex flex-col gap-y-1 items-center" },
                  h("img", { class: "w-8 h-8", src: "/images/icon-user.svg" }),
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
