import { QRL, Signal, createContextId, useContext, useContextProvider, useSignal, $ } from "@builder.io/qwik";
import { useFormValue } from "./form";
import { useOnChange } from "qwik-hueeye";

export interface ControlValueProps<T> {
  required?: boolean;
  name?: string;
  value?: T;
  'bind:value'?: Signal<T | undefined>;
  onValueChange$?: QRL<(value: T) => any>;
}

export const ControlValueContext = createContextId<Signal<any>>('ControlValueContext');
export function useControlValue<T>() {
  return useContext<Signal<T>>(ControlValueContext)
}
export function useControlValueProvider<T>(props: ControlValueProps<T>, initial?: T) {
  const value = useFormValue<T>(props.name);
  const initialValue = props.value ?? value ?? initial ?? '' as T;
  const signalValue = useSignal<T>(props.value ?? value ?? '' as T);
  const bindValue = props["bind:value"] ?? signalValue;
  useOnChange(bindValue, $((change) => {
    if (typeof change !== 'undefined' && props.onValueChange$) props.onValueChange$(change);
  }));
  useContextProvider(ControlValueContext, bindValue);
  return {bindValue, initialValue};
}

export const extractControlProps = <T extends ControlValueProps<any>>(props: T) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { name, value, 'bind:value': bindValue, onValueChange$, ...attr} = props;
  return attr;
}