import type { QwikJSX, Signal, QwikSubmitEvent, QRL} from "@builder.io/qwik";
import { useVisibleTask$} from "@builder.io/qwik";
import { useTask$, useSignal } from "@builder.io/qwik";
import { $, component$, createContextId, useContextProvider, useStore, Slot, useContext } from "@builder.io/qwik";
import type { FormFieldRecord } from "./types";
import { getFormValue } from "./utils";

type FormAttributes = QwikJSX.IntrinsicElements['form'];


export interface FormProps<T extends FormFieldRecord> extends Omit<FormAttributes, 'onSubmit$'> {
  onSubmit$?: QRL<(event: QwikSubmitEvent<HTMLFormElement>, form: HTMLFormElement) => any>;
  value?: Signal<T>
}

export const FormContext = createContextId<FormState<any>>('FormContext');


export interface FormState<T extends FormFieldRecord = any> {
  submitted: boolean;
  dirty: boolean;
  valid: boolean;
  value: T;
  updateCount: number;
}

export function useFormController(input: Signal<HTMLInputElement | undefined>) {
  const form = useForm();
  const onBlur = $(() => {
    form.updateCount++;
    form.dirty = true;
  });
  useVisibleTask$(() => {
    const el = input.value;
    if (!el) return;
    el.addEventListener('blur', onBlur);
    return () => el.removeEventListener('blur', onBlur);
  })
}

export function useForm<T extends FormFieldRecord>() {
  return useContext<FormState<T>, FormState<T>>(FormContext, {
    submitted: false,
    dirty: false,
    valid: false,
    value: {},
    updateCount: 0
  } as any);
}

export const Form = component$((props: FormProps<any>) => {
  const { onSubmit$, value, ...attributes } = props;
  const ref = useSignal<HTMLFormElement>();
  const state = useStore<FormState>({
    submitted: false,
    dirty: false,
    valid: false,
    value: value?.value ?? {},
    updateCount: 0
  });
  useContextProvider<FormState<any>>(FormContext, state);

  useTask$(({ track }) => {
    track(() => state.updateCount);
    if (!ref.value) return;
    const value = getFormValue(ref.value);
    state.value = value;
  });
  
  const submit = $((event: QwikSubmitEvent<HTMLFormElement>, form: HTMLFormElement) => {
    state.submitted = true;
    if (onSubmit$) onSubmit$(event, form);
  });

  return <form {...attributes} ref={ref} onSubmit$={submit} preventdefault:submit>
    <Slot/>
  </form>
});
