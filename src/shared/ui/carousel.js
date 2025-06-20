import { h } from "@/shared/element-helper/element-helper";
import { tv } from "tailwind-variants";
import { SwiperLeftIcon, SwiperRightIcon } from "../icon/icon";

export function CarouselMockup() {
  return h("div", { class: "h-50 md:h-100 lg:h-125 bg-gray-6 px-7.5 py-5 flex justify-between" }, [
    h("button", { class: "" }, h(SwiperLeftIcon), h("span", { class: "sr-only" }, "이전")),
    h("ul", { class: "flex gap-x-1.5 self-end" }, [
      CarouselCircle({ color: "black" }),
      CarouselCircle({ color: "white" }),
      CarouselCircle({ color: "white" }),
      CarouselCircle({ color: "white" }),
      CarouselCircle({ color: "white" }),
    ]),
    h("button", { class: "" }, h(SwiperRightIcon), h("span", { class: "sr-only" }, "이후")),
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
