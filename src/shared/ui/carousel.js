import { tv } from "tailwind-variants";
import { h } from "@/shared/element-helper/element-helper";

export function CarouselMockup() {
  return h("div", { class: "h-50 md:h-100 lg:h-125 bg-gray-6 px-7.5 py-5 flex justify-between" }, [
    h(
      "button",
      { class: "" },
      h("img", { src: `${import.meta.env.BASE_URL}images/icon-swiper-left.svg`, alt: "이전", class: "w-15 h-31 ml-4" }),
    ),
    h("ul", { class: "flex gap-x-1.5 self-end" }, [
      CarouselCircle({ color: "black" }),
      CarouselCircle({ color: "white" }),
      CarouselCircle({ color: "white" }),
      CarouselCircle({ color: "white" }),
      CarouselCircle({ color: "white" }),
    ]),
    h(
      "button",
      { class: "" },
      h("img", {
        src: `${import.meta.env.BASE_URL}images/icon-swiper-right.svg`,
        alt: "이후",
        class: "w-15 h-31 ml-4",
      }),
    ),
  ]);
}

const carouselCircleStyle = tv({
  base: "h-1.5 w-1.5 rounded-full",
  variants: {
    color: {
      black: "bg-black",
      white: "bg-white",
    },
  },
});
function CarouselCircle({ color }) {
  return h("li", { class: carouselCircleStyle({ color }) });
}
