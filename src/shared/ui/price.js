import { formatNumber } from "@/shared/utils/format-number";
import { tv } from "tailwind-variants";
import { h } from "../element-helper/element-helper";

const style = tv({
  slots: {
    base: "flex items-baseline gap-x-0.5",
    number: "font-bold",
  },
  variants: {
    size: {
      md: {
        base: "text-base",
        number: "text-2xl",
      },
      lg: {
        base: "text-lg",
        number: "text-4xl",
      },
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export function Price({ children, price, size, class: className, ...rest }) {
  const { base, number } = style({ size });
  return h(
    "span",
    { class: base({ className }), ...rest },
    h("span", { class: number() }, () => formatNumber(price())),
    "원",
  );
}
