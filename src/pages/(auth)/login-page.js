import { createForm } from "@/features/form/create-form";
import { FormField } from "@/features/form/ui";
import { auth } from "@/shared/auth/auth";
import { loginPasswordSchema, loginUsernameSchema } from "@/shared/auth/schema";
import { createSignal, For, fr, h, Show } from "@/shared/element-helper/element-helper";
import { Link } from "@/shared/router/router";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { tv } from "tailwind-variants";
import { AuthLayout } from "./auth-layout";

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
      history.back();
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
      h(Link, { to: "/signup" }, "회원가입"),
      h("span", null, "|"),
      h(Link, { to: "/forgot-password" }, "비밀번호 찾기"),
    ]),
  );
}

const authTabStyle = tv({
  slots: {
    list: "grid grid-cols-2",
    trigger:
      "bg-gray-6 border-gray-4 relative h-20 rounded-t-md border-x border-t pt-5 text-center text-lg font-medium",
    triggerOrnament: "border-gray-4 absolute -right-0.25 bottom-0 -left-0.25 h-2.5 bg-white",
    panel: "border-gray-4 w-full rounded-b-md border-x border-b bg-white p-8.75 pt-6.25",
  },
  variants: {
    active: {
      true: "",
    },
    position: {
      first: {
        trigger: "",
      },
      last: {
        trigger: "",
      },
    },
  },
  compoundVariants: [
    {
      active: false,
      position: "first",
      class: {
        triggerOrnament: "rounded-tl-md border-t border-l",
      },
    },
    {
      active: false,
      position: "last",
      class: {
        triggerOrnament: "rounded-tr-md border-t border-r",
      },
    },
    {
      active: true,
      position: "first",
      class: {
        trigger: "bg-white",
        triggerOrnament: "border-l bg-white",
      },
    },
    {
      active: true,
      position: "last",
      class: {
        trigger: "bg-white",
        triggerOrnament: "border-r bg-white",
      },
    },
  ],
  defaultVariants: {
    active: false,
  },
});

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
