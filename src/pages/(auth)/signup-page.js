import { createForm } from "@/features/form/create-form";
import { FormCheckbox, FormErrors, FormField, FormInput, FormLabel } from "@/features/form/ui";
import { api } from "@/shared/api";
import { auth } from "@/shared/auth/auth";
import { createSignal, For, fr, h, Show } from "@/shared/element-helper/element-helper";
import { router } from "@/shared/router/router";
import sb from "@/shared/schema/schema-builder";
import { SchemaError } from "@/shared/schema/schema-error";
import { Button } from "@/shared/ui/button";
import { AuthLayout } from "./auth-layout";
import { authTabStyle } from "./auth-tab-style";

const usernameSchema = sb
  .string({ message: "필수 정보입니다." })
  .trim()
  .min(1, "필수 정보입니다.")
  .regex(/^\w{1,20}$/, "20자 이내의 영문 소문자, 대문자, 숫자만 사용 가능합니다.");
const passwordSchema = sb
  .string({ message: "필수 정보입니다." })
  .trim()
  .min(1, "필수 정보입니다.")
  .regex(/^[\w`~!@#$%^&*()_+\-=[\]{}/?\\|.,<>;:'"]{8,}$/, "8자 이상, 영문 대소문자, 숫자, 특수문자를 사용하세요.")
  .regex(/[a-z]/, "비밀번호는 한 개 이상의 영소문자가 필수적으로 들어가야 합니다.")
  .regex(/[0-9]/, "비밀번호는 한 개 이상의 숫자가 필수적으로 들어가야 합니다.");
const nameSchema = sb.string({ message: "필수 정보입니다." }).trim().min(1, "필수 정보입니다.");
const phoneNumberSchema = sb
  .string({ message: "필수 정보입니다." })
  .trim()
  .min(1, "필수 정보입니다.")
  .regex(/^01\d-\d{3,4}-\d{4}$/, "전화번호 형식을 맞춰주세요.");
const agreementSchema = sb.boolean("약관에 동의해주세요.").true("약관에 동의해주세요.");
const storeNameSchema = sb.string({ message: "필수 정보입니다." }).trim().min(1, "필수 정보입니다.");
const companyRegistrationNumberSchema = sb
  .string({ message: "필수 정보입니다." })
  .trim()
  .min(1, "필수 정보입니다.")
  .regex(/^\d{10}$/, "사업자등록번호는 10자리 숫자여야 합니다.");

export function SignupPage() {
  let formElement;
  const form = createForm({
    fields: {
      username: {
        parse: usernameSchema.parse,
      },
      password: {
        parse: passwordSchema.parse,
      },
      confirm_password: {
        parse: (value) => {
          const parsedValue = passwordSchema.parse(value);
          const passwordElement = formElement?.elements["password"];
          if (passwordElement == null) throw "비밀번호 입력이 없습니다.";
          if (passwordElement.value !== parsedValue) throw "비밀번호가 일치하지 않습니다.";
          return parsedValue;
        },
      },
      name: {
        parse: nameSchema.parse,
      },
      phone_number: {
        parse: phoneNumberSchema.parse,
      },
      agreement: {
        type: "checkbox",
        parse: agreementSchema.parse,
      },
      company_registration_number: {
        parse: companyRegistrationNumberSchema.parse,
      },
      store_name: {
        parse: storeNameSchema.parse,
      },
    },
    onsubmit: async (data) => {
      switch (userType()) {
        case "buyer": {
          await api
            .post("/accounts/buyer/signup/")
            .body({
              username: data.username,
              password: data.password,
              name: data.name,
              phone_number: data.phone_number.replaceAll("-", ""),
            })
            .send();
          break;
        }
        case "seller": {
          await api
            .post("/accounts/seller/signup/")
            .body({
              username: data.username,
              password: data.password,
              name: data.name,
              phone_number: data.phone_number.replaceAll("-", ""),
              company_registration_number: data.company_registration_number,
              store_name: data.store_name,
            })
            .send();
          break;
        }
      }
      router.back();
    },
    onerror: async (err, { form }) => {
      if (err instanceof Response) {
        if (err.status === 400) {
          const body = await err.json();
          for (const [name, fieldError] of Object.entries(body)) {
            const field = form.fields[name];
            if (field != null) field.setErrors(fieldError);
          }
        }
      }
    },
  });
  const [userType, setUserType] = createSignal("buyer");
  const [isUsernameChecked, setIsUsernameChecked] = createSignal(false);
  const [isCompanyRegistrationNumberChecked, setIsCompanyRegistrationNumberChecked] = createSignal(false);
  const isValid = () => {
    switch (userType()) {
      case "buyer":
        return (
          isUsernameChecked() &&
          [...Object.values(form.fields)]
            .filter((field) => field.name !== "company_registration_number" && field.name !== "store_name")
            .every((field) => field.isValid())
        );
      case "seller":
        return (
          isUsernameChecked() &&
          isCompanyRegistrationNumberChecked() &&
          [...Object.values(form.fields)].every((field) => field.isValid())
        );
      default:
        return false;
    }
  };
  return h(
    AuthLayout,
    null,
    h("form", { ref: (element) => (formElement = element), onsubmit: form.onsubmit }, [
      h(
        SignupTabView,
        { class: "flex flex-col gap-y-12.5", userType, setUserType },
        h("div", { class: "flex flex-col gap-y-3" }, [
          h(FormField, {
            form,
            name: "username",
            render: (field) =>
              fr(
                h(FormLabel, { field }, "아이디"), //
                h("div", { class: "flex items-center gap-x-3" }, [
                  h(FormInput, {
                    field,
                    onchange: (e) => {
                      if (field.value() === e.currentTarget.value.trim()) return;
                      setIsUsernameChecked(false);
                    },
                  }),
                  h(
                    Button,
                    {
                      type: "button",
                      size: "input",
                      class: "px-8 w-max break-keep",
                      onclick: async () => {
                        try {
                          const username = usernameSchema.parse(field.value());
                          await api.post("/accounts/validate-username/").body({ username }).send();
                          setIsUsernameChecked(true);
                        } catch (error) {
                          if (error instanceof SchemaError) {
                            field.setErrors([error.message]);
                            return;
                          } else if (error instanceof Response) {
                            if (error.status === 409 || error.status === 400) {
                              const body = await error.json();
                              field.setErrors([body.error]);
                              return;
                            }
                          }
                          throw error;
                        }
                      },
                    },
                    "중복확인",
                  ),
                ]),
                h(FormErrors, { field }),
                h(Show, {
                  when: () => isUsernameChecked(),
                  render: () => h("p", { class: "text-brand" }, "멋진 아이디네요 :)"),
                }),
              ),
          }),
          h(FormField, {
            form,
            name: "password",
            render: (field) =>
              fr(
                h(FormLabel, { field }, "비밀번호"), //
                h(PasswordInput, {
                  field,
                  onfocus: () => {
                    invalidatePreviousElements(field);
                  },
                  valid: () => field.isValid(),
                }),
                h(FormErrors, { field }),
              ),
          }),
          h(FormField, {
            form,
            name: "confirm_password",
            render: (field) =>
              fr(
                h(FormLabel, { field }, "비밀번호 재확인"), //
                h(PasswordInput, {
                  field,
                  onfocus: () => {
                    invalidatePreviousElements(field);
                  },
                  valid: () => field.isValid(),
                }),
                h(FormErrors, { field }),
              ),
          }),
        ]),
        h("div", { class: "flex flex-col gap-y-4" }, [
          h(FormField, {
            form,
            name: "name",
            render: (field) =>
              fr(
                h(FormLabel, { field }, "이름"), //
                h(FormInput, {
                  field,
                  onfocus: () => {
                    invalidatePreviousElements(field);
                  },
                }),
                h(FormErrors, { field }),
              ),
          }),
          h(FormField, {
            form,
            name: "phone_number",
            render: (field) =>
              fr(
                h(FormLabel, { field }, "휴대폰번호"), //
                h(PhoneInput, {
                  field,
                  onfocus: () => {
                    invalidatePreviousElements(field);
                  },
                }),
                h(FormErrors, { field }),
              ),
          }),
        ]),
        h(Show, {
          when: () => userType() === "seller",
          render: () =>
            h("div", { class: "flex flex-col gap-y-4" }, [
              h(FormField, {
                form,
                name: "company_registration_number",
                render: (field) =>
                  fr(
                    h(FormLabel, { field }, "사업자 등록번호"), //
                    h("div", { class: "flex items-center gap-x-3" }, [
                      h(FormInput, {
                        field,
                        onchange: (e) => {
                          if (field.value() === e.currentTarget.value.trim()) return;
                          setIsCompanyRegistrationNumberChecked(false);
                        },
                      }),
                      h(
                        Button,
                        {
                          type: "button",
                          size: "input",
                          class: "px-8 w-max break-keep",
                          onclick: async () => {
                            try {
                              const companyRegistrationNumber = companyRegistrationNumberSchema.parse(field.value());
                              await api
                                .post("/accounts/seller/validate-registration-number/")
                                .body({ company_registration_number: companyRegistrationNumber })
                                .send();
                              setIsCompanyRegistrationNumberChecked(true);
                            } catch (error) {
                              if (error instanceof SchemaError) {
                                field.setErrors([error.message]);
                                return;
                              } else if (error instanceof Response) {
                                if (error.status === 404 || error.status === 409 || error.status === 400) {
                                  const body = await error.json();
                                  field.setErrors([body.error]);
                                  return;
                                }
                              }
                              throw error;
                            }
                          },
                        },
                        "인증",
                      ),
                    ]),
                    h(FormErrors, { field }),
                    h(Show, {
                      when: () => isCompanyRegistrationNumberChecked(),
                      render: () => h("p", { class: "text-brand" }, "사용 가능한 사업자 등록번호입니다."),
                    }),
                  ),
              }),
              h(FormField, {
                form,
                name: "store_name",
                render: (field) =>
                  fr(
                    h(FormLabel, { field }, "스토어 이름"), //
                    h(FormInput, {
                      field,
                      onfocus: () => {
                        invalidatePreviousElements(field);
                      },
                    }),
                    h(FormErrors, { field }),
                  ),
              }),
            ]),
        }),
      ),
      h(
        "div",
        { class: "border border-transparent p-8.5 flex flex-col gap-y-8.5" },
        h(FormField, {
          form,
          name: "agreement",
          render: (field) =>
            fr(
              h(
                "div",
                { class: "flex gap-x-2.5 " },
                h(FormCheckbox, { field, class: "my-1" }),
                h(
                  "div",
                  { class: "text-gray-3" },
                  "호두샵의 ",
                  h("button", { type: "button", class: "font-bold underline" }, "이용약관"),
                  " 및 ",
                  h("button", { type: "button", class: "font-bold underline" }, "개인정보처리방침"),
                  "에 대한 내용을 확인하였고 동의합니다.",
                ),
              ),
              h(FormErrors, { field }),
            ),
        }),
        h(Button, { disabled: () => !isValid() }, "가입하기"),
      ),
    ]),
  );

  function invalidatePreviousElements(targetField) {
    if (formElement == null) return;
    for (const element of formElement.elements) {
      const name = element.name;
      if (!name) continue;
      const field = form.fields[name];
      if (field == null) continue;
      if (field.name === targetField.name) break;
      field.invalidate(element.value);
    }
  }
}

function PasswordInput({ valid, ...rest }) {
  return h(
    "div",
    { class: "relative" },
    h(FormInput, {
      class: "pr-15",
      type: "password",
      ...rest,
    }),
    h("img", {
      class: "absolute top-3.25 right-4",
      src: () => `${import.meta.env.BASE_URL}images/icon-check-${valid() ? "on" : "off"}.svg`,
      alt: "",
    }),
  );
}

function PhoneInput({ field, onfocus }) {
  return h("div", { class: "grid grid-cols-3 gap-x-3" }, [
    h("input", {
      type: "hidden",
      name: field.name,
      value: field.value,
    }),
    h(FormInput, {
      type: "tel",
      id: field.id,
      maxlength: 3,
      oninput,
      onchange,
      onfocus,
      "data-index": 0,
      field: { errors: field.errors },
      class:
        "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
    }),
    h(FormInput, {
      type: "tel",
      maxlength: 4,
      oninput,
      onchange,
      onfocus,
      "data-index": 1,
      field: { errors: field.errors },
      class:
        "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
    }),
    h(FormInput, {
      type: "tel",
      maxlength: 4,
      oninput,
      onchange,
      onfocus,
      "data-index": 2,
      field: { errors: field.errors },
      class:
        "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
    }),
  ]);
  function onchange(e) {
    const index = Number(e.currentTarget.dataset.index);
    const items = field.value()?.split("-") ?? ["", "", ""];
    items[index] = e.currentTarget.value;
    const value = items.join("-");
    field.invalidate(value, {
      reject: () => {
        field.setValue(value);
      },
    });
  }
  function oninput(e) {
    const input = e.currentTarget;
    if (input.value.length >= input.maxLength) {
      input.nextSibling?.focus();
      input.nextSibling?.select();
    }
  }
}

function SignupTabView({ class: className, userType, setUserType, children }) {
  const style = authTabStyle();
  const tabData = () => [
    { id: "buyer", label: "구매회원가입" },
    { id: "seller", label: "판매회원가입" },
  ];
  return fr(
    h(
      "div",
      { class: style.list() },
      h(For, {
        each: tabData,
        render: (item, index, items) => {
          const position = index === 0 ? "first" : index === items.length - 1 ? "last" : "";
          const active = () => item.id === userType();
          return h(
            "button",
            {
              type: "button",
              class: () => style.trigger({ position, active: active() }),
              onclick: () => setUserType(item.id),
            },
            h("div", null, item.label),
            h("div", { class: () => style.triggerOrnament({ position, active: active() }) }),
          );
        },
        resolveKey: (item) => item.id,
      }),
    ),
    h("div", { class: style.panel({ className }) }, children),
  );
}
