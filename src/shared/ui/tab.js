import { createSignal, For, h } from "@/shared/element-helper/element-helper";
import { tv } from "tailwind-variants";

const tabMockupStyle = tv({
  base: "grid",
  variants: {
    cols: {
      4: "grid-cols-4",
    },
  },
});
export function TabMockup(props) {
  const [value, setValue] = createSignal(0);
  const items = () => [
    { label: "버튼", value: 0 },
    { label: "리뷰", value: 1 },
    { label: "Q&A", value: 2 },
    { label: "반품/교환정보", value: 4 },
  ];

  return h(
    "div",
    { class: tabMockupStyle({ cols: 4, class: props.class }) },
    h(For, {
      each: items,
      render: (item) =>
        h(
          TabTrigger,
          {
            active: () => value() === item.value,
            onclick: (e) => {
              setValue(item.value);
            },
          },
          item.label,
        ),
    }),
  );
}

const tabTriggerStyle = tv({
  base: "hover:border-brand hover:text-brand flex h-15 w-full items-center justify-center border-b-4 text-center transition-all hover:border-b-8 active:border-b-8",
  variants: {
    active: {
      true: "text-brand border-brand",
      false: "text-gray-3 border-gray-5",
    },
  },
  defaultVariants: {
    active: false,
  },
});
function TabTrigger(props) {
  return h(
    "button",
    { class: () => tabTriggerStyle({ active: props.active() }), onclick: props.onclick },
    props.children,
  );
}
