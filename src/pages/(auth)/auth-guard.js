import { h } from "@/shared/element-helper/element-helper";
import { router } from "@/shared/router/router";
import { Button } from "@/shared/ui/button";

export const authGuard = {
  Component: AuthGuardModal,
  showModal,
  close,
};

let dialogElement;
function close() {
  dialogElement?.close();
}
function showModal() {
  dialogElement?.showModal();
}

function AuthGuardModal() {
  return h(
    "dialog",
    {
      ref: (element) => (dialogElement = element),
      class: "m-auto",
    },
    h(
      "form",
      { method: "dialog", class: "border border-gray-4 relative px-18.5 pt-12.25 pb-9.75 flex flex-col gap-y-7.5" },
      [
        h(
          "button",
          {
            class: "absolute top-4.5 right-4.5",
            autofocus: true,
            onclick: close,
          },
          h("img", { src: `${import.meta.env.BASE_URL}images/icon-delete.svg`, alt: "닫기" }),
        ),
        h("p", { class: "whitespace-pre-line text-center" }, "로그인이 필요한 서비스입니다.\n로그인 하시겠습니까?"),
        h("div", { class: "grid sm:grid-cols-2 gap-2.5" }, [
          h(
            Button,
            {
              size: "sm",
              variant: "outline",
              onclick: close,
            },
            "아니오",
          ),
          h(
            Button,
            {
              size: "sm",
              onclick: () => {
                close();
                router.navigateTo("/login");
              },
            },
            "예",
          ),
        ]),
      ],
    ),
  );
}
