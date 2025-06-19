import { tv } from "tailwind-variants";
import { h } from "../element-helper/element-helper";

export const buttonStyle = tv({
  base: "flex w-full items-center justify-center gap-x-2 rounded-sm text-center disabled:cursor-not-allowed",
  variants: {
    size: {
      sm: "h-10 font-medium",
      input: "h-13.5 font-medium",
      md: "h-15 font-bold",
      lg: "h-17 font-bold",
    },
    variant: {
      primary: "bg-brand disabled:bg-gray-4 text-white hover:opacity-95 active:opacity-90 disabled:text-white",
      secondary: "bg-gray-3 disabled:bg-gray-4 text-white hover:opacity-95 active:opacity-90 disabled:text-white",
      outline:
        "border-gray-4 text-gray-3 hover:border-gray-3 active:border-gray-3 border hover:text-black active:text-black",
    },
  },
  defaultVariants: {
    size: "md",
    variant: "primary",
  },
});

export function Button({ children, size, variant, class: className, ...rest }) {
  return h("button", { class: buttonStyle({ size, variant, className }), ...rest }, ...children);
}
