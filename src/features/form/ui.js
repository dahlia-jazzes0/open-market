import { For, h } from "@/shared/element-helper/element-helper";
import { CheckIcon } from "@/shared/icon/icon";
import { tv } from "tailwind-variants";

export function FormField({ form, name, render }) {
  const id = crypto.randomUUID();
  const field = form.fields[name];
  if (field == null) throw new Error(`Field ${name} not found in form`);
  return h("div", { class: "flex flex-col gap-y-2.5" }, () =>
    render({
      id,
      name,
      ...field,
    }),
  );
}

const formInputStyle = tv({
  base: "border-gray-4 focus:border-brand invalid:border-red h-13.5 w-full rounded-sm border bg-white p-4 focus:outline-none",
  variants: {
    state: {
      invalid: "border-red",
    },
  },
});
export function FormInput({ field, class: className, children, ...rest }) {
  return h("input", {
    class: () => formInputStyle({ className, state: field.errors().length > 0 ? "invalid" : "" }),
    id: field.id,
    name: field.name,
    value: field.value,
    onblur: field.onblur,
    ...rest,
  });
}

const formCheckboxStyle = tv({
  base: "border-gray-4 has-checked:border-brand inline-flex h-4 w-4 shrink-0 grow-0 basis-4 items-center justify-center border select-none",
});
export function FormCheckbox({ field, class: className, children, ...rest }) {
  return h("label", { class: formCheckboxStyle({ className }) }, [
    h("input", {
      type: "checkbox",
      class: "hidden peer",
      id: field.id,
      name: field.name,
      checked: field.value,
      onchange: field.onblur,
      ...rest,
    }),
    h(CheckIcon, { class: "hidden peer-checked:block text-brand" }),
  ]);
}

const formLabelStyle = tv({
  base: "text-gray-3",
});
export function FormLabel({ field, class: className, children, ...rest }) {
  return h(
    "label",
    {
      class: formLabelStyle({ className }),
      for: field.id,
      ...rest,
    },
    children,
  );
}

export function FormErrors({ field, class: className }) {
  return h(For, {
    each: field.errors,
    render: (error) => h(FormErrorView, { className }, error),
    resolveKey: (error) => error,
  });
}

const formErrorViewStyle = tv({
  base: "text-red",
});
function FormErrorView({ class: className, children, ...rest }) {
  return h(
    "p",
    {
      class: formErrorViewStyle({ className }),
      ...rest,
    },
    ...children,
  );
}
