import { ProductDetailOverview, useProductDetail } from "@/features/product/product-detail";
import { h, Show } from "@/shared/element-helper/element-helper";
import { MainLayout } from "@/shared/ui/main-layout";
import { TabMockup } from "@/shared/ui/tab";

export function ProductDetailPage({ params: { productId } }) {
  const data = useProductDetail(productId);

  return h(MainLayout, null, [
    h(Show, { when: () => data() != null, render: () => h(ProductDetailOverview, data()) }), //
    h(TabMockup, { class: "mt-35" }),
  ]);
}
