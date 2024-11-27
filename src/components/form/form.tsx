import { $, PropsOf, QRL, Slot, component$, useOn } from "@builder.io/qwik";
import { FormControlProps, useFormProvider } from "./control";

type FormProps<T extends object> =  PropsOf<'form'> & FormControlProps<T> & {
  onFormSubmit$?: QRL<(value: T, el: HTMLFormElement) => any>
  onFormChange$?: QRL<(value: T, el: HTMLFormElement) => any>
}

export const Form = component$(function <T extends object>(props: FormProps<T>) {
  const { form } = useFormProvider(props);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { value, 'bind:value': bindValue, onFormSubmit$, onFormChange$, ...attr } = props;
  useOn('submit', $((e, el: HTMLFormElement) => onFormSubmit$?.(form, el)));
  useOn('change', $((e, el: HTMLFormElement) => onFormChange$?.(form, el)));
  return <form
    {...attr}
    preventdefault:submit
  >
    <Slot />
  </form>
});

/** Deeply mutate the form */
export function resetForm<T>(source: T, target: Partial<T>): void {
  for (const key in target) {
    const sourceValue = source[key];
    const targetValue = target[key];

    if (typeof targetValue === 'object' && targetValue !== null) {
      if (sourceValue === undefined) {
        if (Array.isArray(targetValue)) {
          (source as any)[key] = [];
        } else if (targetValue instanceof Date) {
          (source as any)[key] = new Date(targetValue.getTime());
        } else {
          (source as any)[key] = {};
        }
      }

      // Remove remaining items if array
      if (Array.isArray(sourceValue) && Array.isArray(targetValue)) {
        sourceValue.splice(targetValue.length, sourceValue.length);
      }

      resetForm(source[key], targetValue);
    } else {
      (source as any)[key] = targetValue;
    }
  }
}