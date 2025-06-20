import { h } from "../element-helper/element-helper";

export function Icon({ as, width, height, ...rest }) {
  return h("svg", { width, height, ...rest }, h("use", { href: `${import.meta.env.BASE_URL}images/icons.svg#${as}` }));
}

export function PlusIcon(options) {
  return h(Icon, { as: "plus", width: 20, height: 20, ...options });
}

export function MinusIcon(options) {
  return h(Icon, { as: "minus", width: 20, height: 20, ...options });
}

export function CircleCheckIcon(options) {
  return h(Icon, { as: "circle-check", width: 28, height: 28, ...options });
}

export function CheckIcon(options) {
  return h(Icon, { as: "check", width: 12, height: 10, ...options });
}

export function UserIcon(options) {
  return h(Icon, { as: "user", width: 32, height: 32, ...options });
}

export function ShoppingCartIcon(options) {
  return h(Icon, { as: "shopping-cart", width: 32, height: 32, ...options });
}

export function ShoppingBagIcon(options) {
  return h(Icon, { as: "shopping-bag", width: 32, height: 32, ...options });
}

export function SwiperLeftIcon(options) {
  return h(Icon, { as: "swiper-left", width: 60, height: 124, ...options });
}

export function SwiperRightIcon(options) {
  return h(Icon, { as: "swiper-right", width: 60, height: 124, ...options });
}

export function DeleteIcon(options) {
  return h(Icon, { as: "delete", width: 22, height: 22, ...options });
}
