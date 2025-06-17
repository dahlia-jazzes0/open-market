import { apiClient } from "@/shared/api/client";
import { useApi } from "@/shared/api/hook";
import { createEffect, createMemo, createSignal, h } from "@/shared/element-helper/element-helper";
import { navigateTo } from "@/shared/router/router";
import { Button } from "@/shared/ui/button";
import { ProductImage } from "@/shared/ui/product-image";
import { formatNumber } from "@/shared/utils/format-number";

export function ProductDetailOverview({ title, seller, thumbnailUrl, price, stock }) {
  const [count, setCount] = createSignal(1);
  const min = Math.min(1, stock);
  const max = stock;
  return h("section", { class: "mt-20 grid justify-center lg:grid-cols-2 text-lg gap-12.5" }, [
    h("h2", { class: "sr-only" }, "상품 개요"),
    h(ProductImage, { src: thumbnailUrl, alt: "", size: "md" }), //
    h("div", { class: "flex flex-col justify-between" }, [
      h("div", null, [
        h("p", { class: "text-gray-3 mb-4" }, seller), //
        h("p", { class: "text-4xl mb-5" }, title),
        h(
          "p",
          { class: "flex items-baseline gap-x-0.5" },
          h("span", { class: "text-4xl font-bold" }, formatNumber(price)),
          "원",
        ),
      ]),
      h("div", { class: "flex flex-col max-w-150" }, [
        h("p", { class: "text-gray-3 pb-5 mb-7.5 border-b-2 border-gray-4 text-base" }, "택배배송 / 무료배송"), //

        h(NumericInput, {
          value: count,
          onChange: setCount,
          min,
          max,
        }),
        h(
          "div",
          {
            class:
              "text-gray-3 pt-5 mt-7.5 border-t-2 border-gray-4 flex flex-wrap items-baseline justify-between break-keep whitespace-nowrap",
          },
          h("span", { class: "font-medium" }, "총 상품 금액"), //
          h("span", { class: "flex items-baseline gap-x-3" }, [
            h("span", { class: "text-gray-3" }, "총 수량 ", h("span", { class: "text-brand" }, count), "개"),
            h("span", { class: "text-gray-4" }, "|"),
            h(
              "span",
              { class: "text-brand flex items-baseline gap-x-0.5" },
              h("span", { class: "text-4xl font-bold" }, () => formatNumber(price * count())),
              "원",
            ),
          ]),
        ),
        h("div", { class: "flex items-center gap-x-3.5 mt-5.5" }, [
          h(Button, { class: "flex-2" }, "바로 구매"), //
          h(Button, { variant: "secondary", class: "flex-1" }, "장바구니"), //
        ]),
      ]),
    ]),
  ]);
}

function NumericInput({ value, min, max, onChange }) {
  const [count, setCount] = createSignal(1);
  let ref;
  return h("div", { class: "flex h-12.5 rounded-sm border border-gray-4 w-37.5" }, [
    h(
      "button",
      {
        class:
          "grow-0 shrink-0 basis-12.5 h-full flex justify-center items-center border-r border-gray-4 not-disabled:hover:bg-gray-6/25 not-disabled:active:bg-gray-6/50 disabled:opacity-50 disabled:cursor-not-allowed",
        onclick: () => set(count() - 1),
        disabled: () => count() <= min,
      },
      h("img", { src: `${import.meta.env.BASE_URL}images/icon-minus.svg`, alt: "-", draggable: false }),
    ),
    h("input", {
      type: "number",
      value,
      ref: (element) => (ref = element),
      oninput: (e) => {
        const n = e.currentTarget.valueAsNumber;
        set(n);
      },
      min,
      max,
      class:
        "flex-1 min-w-0 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus-visible:outline-0",
    }),
    h(
      "button",
      {
        class:
          "grow-0 shrink-0 basis-12.5 h-full flex justify-center items-center border-l border-gray-4 not-disabled:hover:bg-gray-6/25 not-disabled:active:bg-gray-6/50 disabled:opacity-50 disabled:cursor-not-allowed",
        onclick: () => set(count() + 1),
        disabled: () => count() >= max,
      },
      h("img", { src: `${import.meta.env.BASE_URL}images/icon-plus.svg`, alt: "+", draggable: false }),
    ),
  ]);
  function set(n) {
    if (Number.isInteger(n)) {
      n = Math.min(max, Math.max(min, n));
      setCount(n);
      onChange(n);
    }
    if (ref != null) ref.value = count();
  }
}

export function useProductDetail(productId) {
  const { data, error } = useApi(async () => apiClient.get(`/products/${productId}`));
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
    return {
      id: p.id,
      title: p.name,
      description: p.info,
      thumbnailUrl: p.image,
      price: p.price,
      stock: p.stock,
      seller: p.seller.name,
    };
  });
}
