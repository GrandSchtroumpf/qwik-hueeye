import { QRL, Signal, createContextId, useContext, useContextProvider, useSignal, useTask$ } from "@builder.io/qwik";
import { useFormValue } from "./form";

export interface ControlValueProps<T> {
  name?: string;
  value?: T;
  'bind:value'?: Signal<T>;
  onValueChange$?: QRL<(value: T) => any>
}

export const ControlValueContext = createContextId<Signal<any>>('ControlValueContext');
export function useControlValue<T>() {
  return useContext<Signal<T>>(ControlValueContext)
}
export function useControlValueProvider<T>(props: ControlValueProps<T>) {
  const value = useFormValue<T>(props.name);
  const signalValue = useSignal<T>(props.value ?? value ?? '' as T);
  const bindValue = props["bind:value"] ?? signalValue;
  useTask$(({ track }) => {
    track(() => bindValue.value);
    if (props.onValueChange$) props.onValueChange$(bindValue.value);
  })
  useContextProvider(ControlValueContext, bindValue);
  return bindValue;
}

export const extractControlProps = <T extends ControlValueProps<any>>(props: T) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { name, value, 'bind:value': bindValue, onValueChange$, ...attr} = props;
  return attr;
}