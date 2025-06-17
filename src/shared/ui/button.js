import { tv } from "tailwind-variants";
import { h } from "../element-helper/element-helper";

export const buttonStyle = tv({
  base: "flex w-full items-center justify-center text-center hover:opacity-95 active:opacity-90",
  variants: {
    size: {
      sm: "h-10 rounded-sm",
      md: "h-15 rounded-sm font-bold",
    },
    variant: {
      primary: "bg-brand text-white",
      secondary: "bg-gray-3 text-white",
      outline: "border-gray-4 text-gray-3 border",
    },
    disabled: {
      true: "bg-gray-4 text-white",
    },
  },
  defaultVariants: {
    size: "md",
    variant: "primary",
    disabled: false,
  },
});

export function Button({ children, size, variant, disabled, class: className, ...rest }) {
  return h("button", { class: buttonStyle({ size, variant, disabled, className }), ...rest }, ...children);
}
