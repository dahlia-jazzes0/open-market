import { apiClient } from "@/shared/api/client";
import { useApi } from "@/shared/api/hook";
import { createEffect, createMemo, For, h, Show } from "@/shared/element-helper/element-helper";
import { Link } from "@/shared/router/router";
import { ProductImage } from "@/shared/ui/product-image";
import { formatNumber } from "@/shared/utils/format-number";
import { tv } from "tailwind-variants";

const productSummaryListStyle = tv({
  base: "grid justify-items-center gap-16 md:grid-cols-2 lg:grid-cols-3",
});
export function ProductSummaryList(props) {
  const products = useProductSummaryList();

  return h(
    "ul",
    { class: productSummaryListStyle({ class: props.class }) },
    h(For, {
      each: products, //
      render: (props) => h(Link, { to: `/products/${props.id}` }, h(ProductSummaryView, props)),
      resolveKey: (product) => product.id,
    }),
  );
}

export function ProductSummaryView({ title, seller, thumbnailUrl, price, isSoldOut }) {
  return h("li", { class: "flex flex-col gap-y-4" }, [
    h(ProductImage, { src: thumbnailUrl, alt: "", class: "border-gray-4 rounded-xl border" }),
    h(
      "div",
      { class: "flex flex-col gap-y-2.5" },
      h("p", { class: "text-gray-3" }, seller),
      h(
        "p",
        { class: "text-lg" },
        title,
        Show({ when: () => isSoldOut, render: () => h("span", { class: "text-red" }, "[품절]") }),
      ),
      h("p", { class: "flex items-baseline gap-x-0.5" }, h("span", { class: "text-2xl" }, formatNumber(price)), "원"),
    ),
  ]);
}

export function useProductSummaryList() {
  const { data, error } = useApi(async () => apiClient.get("/products"));
  createEffect(() => {
    const err = error();
    if (err != null) {
      console.error(err);
      navigateTo("/error", err);
    }
  });
  return createMemo(() => {
    const p = data();
    if (p == null) return null;
    return p.results.map((product) => ({
      id: product.id,
      title: product.name,
      seller: product.seller.name,
      thumbnailUrl: product.image,
      price: product.price,
      isSoldOut: product.stock <= 0,
    }));
  });
}
