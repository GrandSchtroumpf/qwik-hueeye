import { $, PropsOf, QRL, Slot, component$, useOn } from "@builder.io/qwik";
import { FormControlProps, useFormProvider } from "./control";
import type { ControlGroup } from './types';

type FormProps<T extends ControlGroup> =  PropsOf<'form'> & FormControlProps<T> & {
  onFormSubmit$?: QRL<(value: T, el: HTMLFormElement) => any>
  onFormChange$?: QRL<(value: T, el: HTMLFormElement) => any>
}

export const Form = component$(function <T extends ControlGroup>(props: FormProps<T>) {
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
