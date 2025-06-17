import { tv } from "tailwind-variants";
import { h } from "@/shared/element-helper/element-helper";

const style = tv({
  base: "aspect-square min-h-0 min-w-0 overflow-clip object-cover",
  variants: {
    size: {
      sm: "w-95",
      md: "w-150",
    },
  },
  defaultVariants: { size: "sm" },
});

export function ProductImage(props) {
  return h("img", {
    src: props.src,
    alt: props.alt,
    class: style({ size: props.size, class: props.class }),
  });
}
