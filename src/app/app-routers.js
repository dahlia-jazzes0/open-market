import { NotFoundErrorPage } from "@/pages/error-page";
import { MainPage } from "@/pages/main-page";
import { ProductDetailPage } from "@/pages/product-page";
import { h } from "@/shared/element-helper/element-helper";
import { Routes } from "@/shared/router/router";

export function AppRoutes() {
  return h(Routes, {
    notFound: NotFoundErrorPage,
    routes: {
      "/": MainPage,
      "/products/:productId": ProductDetailPage,
    },
  });
}
