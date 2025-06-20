import { api } from "@/shared/api";
import { useApi } from "@/shared/api/hook";
import { createEffect, For, h, Show } from "@/shared/element-helper/element-helper";
import { Link, router } from "@/shared/router/router";
import { Price } from "@/shared/ui/price";
import { ProductImage } from "@/shared/ui/product-image";
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
    h(ProductImage, { src: thumbnailUrl, alt: "", class: "border-gray-4 rounded-md border" }),
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
      h(Price, { price: () => price }),
    ),
  ]);
}

export function useProductSummaryList() {
  const { data, error } = useApi(async () => api.get("/products").send());
  createEffect(() => {
    const err = error();
    if (err != null) {
      console.error(err);
      router.navigateTo("/error", { replace: true });
    }
  });
  return () => {
    const p = data();
    if (p == null) return [];
    return p.results.map((product) => ({
      id: product.id,
      title: product.name,
      seller: product.seller.name,
      thumbnailUrl: product.image,
      price: product.price,
      isSoldOut: product.stock <= 0,
    }));
  };
}
