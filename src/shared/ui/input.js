import { h } from "@/shared/element-helper/element-helper";
import { tv } from "tailwind-variants";

const style = tv({
  base: "border-gray-4 focus:border-brand placeholder:text-gray-3 h-15 w-full border-b outline-none",
});

export function Input({ class: className, ...rest }) {
  return h("input", {
    class: style({ className }),
    ...rest,
  });
}
