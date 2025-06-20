import { ProductDetailOverview, useProductDetail } from "@/features/product/product-detail";
import { h, Show } from "@/shared/element-helper/element-helper";
import { TabMockup } from "@/shared/ui/tab";
import { MainLayout } from "./main-layout";

export function ProductDetailPage({ params: { productId } }) {
  const data = useProductDetail(productId);

  return h(
    MainLayout,
    null,
    h(
      "div",
      { class: "xl:w-7xl mx-auto" },
      h(Show, { when: () => data() != null, render: () => h(ProductDetailOverview, data()) }), //
      h(TabMockup, { class: "mt-35" }),
    ),
  );
}
