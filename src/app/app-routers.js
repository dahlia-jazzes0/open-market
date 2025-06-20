import { LoginPage } from "@/pages/(auth)/login-page";
import { SignupPage } from "@/pages/(auth)/signup-page";
import { NotFoundErrorPage } from "@/pages/error-page";
import { MainPage } from "@/pages/(main)/main-page";
import { ProductDetailPage } from "@/pages/(main)/product-page";
import { h } from "@/shared/element-helper/element-helper";
import { Routes } from "@/shared/router/router";

export function AppRoutes() {
  return h(Routes, {
    notFound: NotFoundErrorPage,
    routes: {
      "/": MainPage,
      "/products/:productId": ProductDetailPage,
      "/login": LoginPage,
      "/signup": SignupPage,
    },
  });
}
