import { h } from "@/shared/element-helper/element-helper";
import { Link } from "@/shared/router/router";
import { Button, buttonStyle } from "@/shared/ui/button";

export function NotFoundErrorPage() {
  return h(
    "div",
    { class: "h-dvh flex justify-center items-center" },
    h(
      "div",
      { class: "flex flex-col md:flex-row gap-12.5 items-center" },
      h("img", { class: "w-69 aspect-[69/59]", src: `${import.meta.env.BASE_URL}images/icon-404.svg`, alt: "" }),
      h("section", { class: "flex flex-col max-w-103.5" }, [
        h("h2", { class: "font-bold text-4xl mb-5" }, "페이지를 찾을 수 없습니다."),
        h(
          "p",
          { class: "text-gray-3 whitespace-pre-line mb-10" },
          "페이지가 존재하지 않거나 사용할 수 없는 페이지입니다.\n웹 주소가 올바른지 확인해 주세요.",
        ),
        h(
          "div",
          { class: "flex gap-3.5" },
          h(Link, { to: "/", class: buttonStyle() }, "메인으로"),
          h(Button, { variant: "outline", onclick: () => history.back() }, "이전 페이지"),
        ),
      ]),
    ),
  );
}
