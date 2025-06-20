import { createForm } from "@/features/form/create-form";
import { FormField } from "@/features/form/ui";
import { auth } from "@/shared/auth/auth";
import { loginPasswordSchema, loginUsernameSchema } from "@/shared/auth/schema";
import { createSignal, For, fr, h, Show } from "@/shared/element-helper/element-helper";
import { Link, router } from "@/shared/router/router";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { AuthLayout } from "./auth-layout";
import { authTabStyle } from "./auth-tab-style";

export function LoginPage() {
  const form = createForm({
    fields: {
      username: {
        parse: loginUsernameSchema.parse,
      },
      password: {
        parse: loginPasswordSchema.parse,
      },
    },
    onsubmit: async ({ username, password }) => {
      await auth.login(username, password);
      setError(null);
      router.back();
    },
    onerror: async (error, { formElement }) => {
      if (error instanceof Response) {
        const body = await error.json();
        setError(body.error);
        formElement.elements.password.value = "";
        formElement.elements.password.focus();
        return;
      }
      throw error;
    },
  });
  const [error, setError] = createSignal(null);
  return h(
    AuthLayout,
    null,
    h(
      "form",
      {
        onsubmit: form.onsubmit,
      },
      [
        h(LoginTabView, null, [
          h(FormField, {
            form,
            name: "username",
            render: (field) =>
              h(Input, {
                id: field.id,
                name: field.name,
                value: field.value,
                onblur: field.onblur,
                placeholder: "아이디",
              }),
          }),
          h(FormField, {
            form,
            name: "password",
            render: (field) =>
              h(Input, {
                type: "password",
                id: field.id,
                name: field.name,
                value: field.value,
                onblur: field.onblur,
                placeholder: "비밀번호",
              }),
          }),
          h(
            "ul",
            { class: "py-4.5 text-red font-medium" },
            h(Show, {
              when: () => error() != null,
              render: () => h("li", { class: "my-2" }, error()),
            }),
          ),
          h(Button, {}, "로그인"),
        ]),
      ],
    ),
    h("div", { class: "mt-7.5 text-gray-1 flex flex-wrap items-center justify-center gap-x-3.5" }, [
      h(Link, { to: "/signup", replace: true }, "회원가입"),
      h("span", null, "|"),
      h(Link, { to: "/forgot-password" }, "비밀번호 찾기"),
    ]),
  );
}

function LoginTabView(props) {
  const style = authTabStyle();
  const [selection, setSelection] = createSignal("buyer");
  const tabData = () => [
    { id: "buyer", label: "구매회원 로그인" },
    { id: "seller", label: "판매회원 로그인" },
  ];
  return fr(
    h(
      "div",
      { class: style.list() },
      h(For, {
        each: tabData,
        render: (item, index, items) => {
          const position = index === 0 ? "first" : index === items.length - 1 ? "last" : "";
          const active = () => item.id === selection();
          return fr(
            h("input", {
              class: "hidden",
              type: "radio",
              name: "type",
              id: item.id,
              value: item.id,
              checked: active,
            }),
            h(
              "label",
              {
                class: () => style.trigger({ position, active: active() }),
                for: item.id,
                onclick: () => {
                  setSelection(item.id);
                },
              },
              item.label,
              h("div", { class: () => style.triggerOrnament({ position, active: active() }) }),
            ),
          );
        },
        resolveKey: (item) => item.id,
      }),
    ),
    h("div", { class: style.panel() }, props.children),
  );
}
