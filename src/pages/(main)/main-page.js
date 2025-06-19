import { ProductSummaryList } from "@/features/product/product-summary";
import { h } from "@/shared/element-helper/element-helper";
import { CarouselMockup } from "@/shared/ui/carousel";
import { MainLayout } from "./main-layout";

export function MainPage() {
  return h(MainLayout, null, [
    h(CarouselMockup), //
    h(ProductSummaryList, { class: "mt-20" }),
  ]);
}
