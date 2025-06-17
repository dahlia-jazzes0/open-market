import { h } from "@/shared/element-helper/element-helper";

export function FooterView() {
  return h(
    "footer",
    { class: "bg-gray-6 text-sm py-15" },
    h(
      "div",
      {
        class: "xl:w-7xl mx-auto flex flex-col gap-y-7.5",
      },
      [
        h("div", { class: "pb-7.5 border-b border-gray-4 flex justify-between items-center" }, [
          h("ul", { class: "flex gap-3.5 flex-wrap" }, [
            h(
              "li",
              { class: "not-first:before:content-['|'] not-first:before:mr-3.5" },
              h("a", { href: "#" }, "호두샵 소개"),
            ),
            h(
              "li",
              { class: "not-first:before:content-['|'] not-first:before:mr-3.5" },
              h("a", { href: "#" }, "이용약관"),
            ),
            h(
              "li",
              { class: "not-first:before:content-['|'] not-first:before:mr-3.5 font-bold" },
              h("a", { href: "#" }, "개인정보처리방침"),
            ),
            h(
              "li",
              { class: "not-first:before:content-['|'] not-first:before:mr-3.5" },
              h("a", { href: "#" }, "전자금융거래약관"),
            ),
            h(
              "li",
              { class: "not-first:before:content-['|'] not-first:before:mr-3.5" },
              h("a", { href: "#" }, "청소년보호정책"),
            ),
            h(
              "li",
              { class: "not-first:before:content-['|'] not-first:before:mr-3.5" },
              h("a", { href: "#" }, "제휴문의"),
            ),
          ]),
          h("ul", { class: "flex gap-x-3.5" }, [
            h(
              "li",
              null,
              h(
                "a",
                { href: "#" },
                h("img", {
                  class: "w-8 h-8",
                  src: `${import.meta.env.BASE_URL}images/icon-insta.svg`,
                  alt: "호두 인스타그램",
                }),
              ),
            ),
            h(
              "li",
              null,
              h(
                "a",
                { href: "#" },
                h("img", {
                  class: "w-8 h-8",
                  src: `${import.meta.env.BASE_URL}images/icon-fb.svg`,
                  alt: "호두 페이스북",
                }),
              ),
            ),
            h(
              "li",
              null,
              h(
                "a",
                { href: "#" },
                h("img", {
                  class: "w-8 h-8",
                  src: `${import.meta.env.BASE_URL}images/icon-yt.svg`,
                  alt: "호두 유튜브",
                }),
              ),
            ),
          ]),
        ]),
        h(
          "address",
          null,
          h(
            "ul",
            { class: "text-gray-3 not-italic leading-6" },
            h("li", { class: "font-bold" }, "(주)HODU SHOP"),
            h("li", null, "제주특별자치도 제주시 동광고 137 제주코딩베이스캠프"),
            h("li", null, "사업자 번호 : 000-0000-0000 | 통신판매업"),
            h("li", null, "대표 : 김호두"),
          ),
        ),
      ],
    ),
  );
}
