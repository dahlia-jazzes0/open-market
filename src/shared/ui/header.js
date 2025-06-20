import { authGuard } from "@/pages/(auth)/auth-guard";
import { auth } from "@/shared/auth/auth";
import { createEffect, createSignal, h, onCleanup, Show } from "@/shared/element-helper/element-helper";
import { Link } from "../router/router";
import { buttonStyle } from "./button";
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
                  "button",
                  {
                    class: "flex flex-col gap-y-1 items-center",
                    onclick: () => {
                      if (auth.user != null) return;
                      authGuard.showModal();
                    },
                  },
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
                h(Show, {
                  when: () => auth.user == null,
                  render: () =>
                    h(
                      Link,
                      { to: "/login", class: "flex flex-col gap-y-1 items-center" },
                      h("img", { class: "w-8 h-8", src: `${import.meta.env.BASE_URL}images/icon-user.svg`, alt: "" }),
                      h("p", { class: "text-xs text-gray-3 break-keep" }, ["로그인"]),
                    ),
                }),
                h(Show, {
                  when: () => auth.user != null,
                  render: () =>
                    h(
                      "div",
                      null,
                      h(Show, {
                        when: () => auth.user?.user_type === "BUYER",
                        render: MyPageDropdown,
                      }),
                      h(Show, {
                        when: () => auth.user?.user_type === "SELLER",
                        render: () =>
                          h(Link, { to: "/business", class: buttonStyle({ size: "input" }) }, [
                            h("img", { src: `${import.meta.env.BASE_URL}images/icon-shopping-bag.svg` }),
                            h("span", { class: "ml-2" }, "판매자 센터"),
                          ]),
                      }),
                    ),
                }),
              ),
            ),
          ]),
        ],
      ),
    ],
  );
}

function MyPageDropdown() {
  let containerElement;
  const [open, setOpen] = createSignal(false);
  createEffect(() => {
    const opened = open();
    if (opened) {
      window.addEventListener("click", handleClick);
    } else {
      window.removeEventListener("click", handleClick);
    }
    onCleanup(() => {
      window.removeEventListener("click", handleClick);
    });
  });
  function handleClick(e) {
    if (containerElement == null || containerElement.contains(e.target)) return;
    setOpen(false);
  }

  return h(
    "div",
    { ref: (element) => (containerElement = element), class: "relative" },
    h(
      "button",
      {
        class: "flex flex-col gap-y-1 items-center",
        onclick: () => {
          setOpen(true);
        },
      },
      h("img", { class: "w-8 h-8", src: `${import.meta.env.BASE_URL}images/icon-user.svg`, alt: "" }),
      h("p", { class: "text-xs text-gray-3 break-keep" }, ["마이페이지"]),
    ),
    h(Show, { when: () => open() === true, render: () => h(MyPageDropdownContent) }),
  );
}

function MyPageDropdownContent() {
  return h(
    "div",
    {
      class:
        "absolute w-32.5 bg-white p-2.5 top-[calc(100%+var(--spacing)*2.5)] right-0 xl:right-auto xl:left-1/2 xl:-translate-x-1/2 drop-shadow-dropdown rounded-md",
    },
    [
      h("div", {
        class: "absolute w-5 h-2.5 bg-white bottom-full left-3/4 xl:left-1/2 xl:-translate-x-1/2",
        style: 'clip-path: path("M13.4641 2C11.9245 -0.6667 8.0755 -0.6667 6.5359 2L1.9171 10H18.0829Z");',
      }),
      h(
        "ul",
        {
          class: "flex flex-col gap-y-2",
        },
        h(
          "li",
          null,
          h(
            "button",
            {
              class:
                "w-full h-10 text-gray-3 border border-transparent rounded-sm hover:text-black active:text-black hover:border-gray-3 active:border-gray-3",
            },
            ["마이페이지"],
          ),
        ),
        h(
          "li",
          null,
          h(
            "button",
            {
              class:
                "w-full h-10 text-gray-3 border border-transparent rounded-sm hover:text-black active:text-black hover:border-gray-3 active:border-gray-3",
              onclick: () => auth.logout(),
            },
            ["로그아웃"],
          ),
        ),
      ),
    ],
  );
}
