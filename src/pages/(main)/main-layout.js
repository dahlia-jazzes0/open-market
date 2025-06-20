import { fr, h } from "@/shared/element-helper/element-helper";
import { FooterView } from "@/shared/ui/footer";
import { HeaderView } from "@/shared/ui/header";
import { authGuard } from "../(auth)/auth-guard";

export function MainLayout(props) {
  return fr(
    h(HeaderView), //
    h("main", { class: "min-h-lvh xl:w-7xl mx-auto pb-8" }, ...props.children),
    h(FooterView),
    h(authGuard.Component),
  );
}
