import { $, component$, createContextId, useContextProvider, useStore, Slot, useContext, useSignal, event$, untrack } from "@builder.io/qwik";
import type { QwikJSX, Signal, QwikSubmitEvent, QRL} from "@builder.io/qwik";
import type { FormFieldRecord } from "./types";
import { getDeepValue } from "./utils";

type FormAttributes = QwikJSX.IntrinsicElements['form'];


export interface FormProps<T extends FormFieldRecord> extends Omit<FormAttributes, 'onSubmit$'> {
  onSubmit$?: QRL<(value: T, form: HTMLFormElement, event: QwikSubmitEvent<HTMLFormElement>) => any>;
  onValueChange$?: QRL<(value: T) => any>;
  'bind:value'?: Signal<T>;
  value?: T
}

export const FormContext = createContextId<FormState<any>>('FormContext');


export interface FormState<T extends FormFieldRecord = any> {
  formRef: Signal<HTMLFormElement | undefined>
  submitted: boolean;
  dirty: boolean;
  invalid: boolean;
  value: T;
  bindValue: Signal<T>;
}


/** Get initial value of the form */
export function useFormValue<T>(name?: string) {
  const form = useForm();
  // We do not want to update the control after initialValue
  const value = untrack(() => form.value);
  if (!name || !value) return;
  return getDeepValue<T>(value, name);
}

export function useForm<T extends FormFieldRecord>() {
  return useContext<FormState<T>, FormState<T>>(FormContext, {
    formRef: useSignal(),
    submitted: false,
    dirty: false,
    invalid: false,
    value: undefined,
    bindValue: useSignal()
  } as any);
}

export const Form = component$((props: FormProps<any>) => {
  const { onSubmit$, onValueChange$, 'bind:value': propsBindValue, value, ...attr } = props;
  const ref = useSignal<HTMLFormElement>();
  const initial = value ?? propsBindValue?.value ?? {};
  const signalValue = useSignal(initial);
  const bindValue = propsBindValue ?? signalValue;

  const state = useStore<Omit<FormState, 'bindValue'>>({
    formRef: ref,
    submitted: false,
    dirty: false,
    invalid: false,
    value: initial,
  }, { deep: false });

  useContextProvider<FormState<any>>(FormContext, {...state, bindValue});

  const change = event$(() => {
    state.dirty = true;
    if (onValueChange$) onValueChange$(state.value);
  });
  
  const submit = $((event: QwikSubmitEvent<HTMLFormElement>, form: HTMLFormElement) => {
    state.submitted = true;
    if (onSubmit$) onSubmit$(bindValue.value, form, event);
  });

  return <form {...attr} ref={ref} onSubmit$={submit} onChange$={change} preventdefault:submit>
    <Slot/>
  </form>
});
