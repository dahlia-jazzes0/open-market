import { createSignal } from "@/shared/element-helper/element-helper";
import { SchemaError } from "@/shared/schema/schema-error";

/**
 * @template T
 * @typedef {() => T} ReadSignal
 */

/**
 * @template T
 * @typedef {(newValue: T | ((prevValue: T) => T)) => void} WriteSignal
 */

/**
 * @template Value
 * @typedef {{
 *   name: string,
 *   type: InputType | undefined,
 *   value: ReadSignal<Value>,
 *   setValue: WriteSignal<Value>,
 *   onblur: (e: Event & { currentTarget: HTMLFormElement }) => void,
 *   errors: ReadSignal<unknown[]>,
 *   setErrors: WriteSignal<unknown[]>,
 *   invalidate: (value: unknown, options?: { resolve?: (value: Value) => void, reject?: (error: unknown) => void }) => void,
 *   isValid: () => boolean,
 * }} Field
 */

/**
 * @template {Record<string, { parse: () => any; }>} Fields
 * @typedef {{
 *   fields: { [Key in keyof Fields]: Field<ReturnType<Fields[Key]["parse"]>> },
 *   onsubmit: (e: Event & { currentTarget: HTMLFormElement }) => Promise<void>
 * }} Form
 */

/**
 * @typedef {"text" | "checkbox"} InputType
 */

/**
 * @template {Record<string, { parse: () => any; type?: InputType }>} Fields
 * @param {{
 *   fields: Fields,
 *   onsubmit: (
 *     data: { [Key in keyof Fields]: ReturnType<Fields[Key]["parse"]> },
 *     options: { form: Form<Fields>, formElement: HTMLFormElement }
 *   ) => Promise<void> | void,
 *   onerror: (
 *     data: unknown,
 *     options: { form: Form<Fields>, formElement: HTMLFormElement }
 *   ) => Promise<void> | void,
 * }} options
 * @returns {Form<Fields>}
 */
export function createForm({ fields, onsubmit, onerror }) {
  const form = {
    fields: {},
    onsubmit: async (e) => {
      e.preventDefault();
      const formElement = e.currentTarget;
      const data = {};
      let hasError = false;
      let hasFocused = false;
      for (const [name, field] of Object.entries(form.fields)) {
        const element = formElement.elements[name];
        if (element == null) throw new Error("Element not found");
        field.invalidate(getValue(element, field.type), {
          resolve: (value) => {
            data[name] = value;
          },
          reject: () => {
            if (!hasFocused) element.focus();
            hasFocused = true;
            hasError = true;
          },
        });
      }
      if (hasError) return;
      try {
        await onsubmit(data, { form, formElement });
      } catch (err) {
        onerror?.(err, { form, formElement });
      }
    },
  };
  for (const [name, fieldConfig] of Object.entries(fields)) {
    const [value, setValue] = createSignal();
    const [errors, setErrors] = createSignal([]);
    const onblur = (e) => {
      invalidate(getValue(e.currentTarget, fieldConfig.type), {
        reject: () => {
          setValue(getValue(e.currentTarget, fieldConfig.type));
        },
      });
    };
    const isValid = () => {
      try {
        fieldConfig.parse(value());
        return true;
      } catch (error) {
        return false;
      }
    };

    form.fields[name] = {
      name,
      type: fieldConfig.type,
      value,
      setValue,
      onblur,
      errors,
      setErrors,
      invalidate,
      isValid,
    };

    function invalidate(value, options) {
      try {
        const parsedValue = fieldConfig.parse(value);
        setValue(parsedValue);
        setErrors([]);
        options?.resolve?.(parsedValue);
      } catch (error) {
        if (error instanceof SchemaError) {
          setErrors([error.message]);
          options?.reject?.(error);
          return;
        }
        throw error;
      }
    }
  }
  return form;
}
/**
 *
 * @param {HTMLInputElement} element
 * @param {InputType} [type]
 */
function getValue(element, type) {
  switch (type) {
    case "checkbox":
      return element.checked;
    default:
      return element.value;
  }
}
