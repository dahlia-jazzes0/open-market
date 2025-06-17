import { h } from "@/shared/element-helper/element-helper";

export function SearchInput() {
  return h("input", {
    class: "min-w-0 max-w-100 h-11.5 border-2 border-brand rounded-full px-5.5 py-3.25",
    placeholder: "상품을 검색해보세요!",
  });
}
