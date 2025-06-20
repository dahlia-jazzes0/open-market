import { tv } from "tailwind-variants";

export const authTabStyle = tv({
  slots: {
    list: "grid grid-cols-2",
    trigger:
      "bg-gray-6 border-gray-4 relative flex h-20 justify-center rounded-t-md border-x border-t pt-5 text-center text-lg font-medium",
    triggerOrnament: "border-gray-4 absolute -right-0.25 bottom-0 -left-0.25 h-2.5 bg-white",
    panel: "border-gray-4 w-full rounded-b-md border-x border-b bg-white p-8.75 pt-6.25",
  },
  variants: {
    active: {
      true: "",
    },
    position: {
      first: {
        trigger: "",
      },
      last: {
        trigger: "",
      },
    },
  },
  compoundVariants: [
    {
      active: false,
      position: "first",
      class: {
        triggerOrnament: "rounded-tl-md border-t border-l",
      },
    },
    {
      active: false,
      position: "last",
      class: {
        triggerOrnament: "rounded-tr-md border-t border-r",
      },
    },
    {
      active: true,
      position: "first",
      class: {
        trigger: "bg-white",
        triggerOrnament: "border-l bg-white",
      },
    },
    {
      active: true,
      position: "last",
      class: {
        trigger: "bg-white",
        triggerOrnament: "border-r bg-white",
      },
    },
  ],
  defaultVariants: {
    active: false,
  },
});
