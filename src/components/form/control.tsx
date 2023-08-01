import { QRL, Signal, createContextId, useContext, useContextProvider, useSignal, $, useVisibleTask$ } from "@builder.io/qwik";
import { useForm, useFormValue } from "./form";
import { useOnChange } from "qwik-hueeye";
import { ArrowsKeys, focusNextInput, focusPreviousInput, useKeyboard } from "../utils";

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
  const { formRef } = useForm();
  const value = useFormValue<T>(props.name);
  const initialValue = props.value ?? value ?? initial ?? '' as T;
  const signalValue = useSignal<T>(initialValue);
  const bindValue = props["bind:value"] ?? signalValue;

  useVisibleTask$(() => {
    const handler = (event: Event) => {
      event.preventDefault();
      bindValue.value = initialValue;
    }
    formRef.value?.addEventListener('reset', handler);
    return () => formRef.value?.removeEventListener('reset', handler);
  });

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

type ControlStrategy = 'item' | 'list' | 'record';
type StrategyType<S extends ControlStrategy> = S extends 'item' ? string
  : S extends 'list' ? string[]
  : S extends 'record' ? Record<string, boolean>
  : never;





const disabledKeys = [...ArrowsKeys, 'Enter', ' ', 'ctrl+a'];

type ControlContextState = ReturnType<typeof useControlProvider>;
export const ControlContext = createContextId<ControlContextState>('ControlContext');

// TODO: merge useControlProvider & useControlValueProvider

export function useControlProvider<S extends ControlStrategy, T extends StrategyType<S>>(strategy: 'item' | 'list' | 'record', props: ControlValueProps<T>) {
  const rootRef = useSignal<HTMLElement>();
  const { bindValue } = useControlValueProvider<T>(props);

  const toggleList = $(() => {
    if (!rootRef.value) return;
    const checkboxes = rootRef.value.querySelectorAll('input[type="checkbox"][value]') as NodeListOf<HTMLInputElement>;
    console.log('Toggle List', checkboxes);
    (bindValue.value as string[]) = bindValue.value?.length === checkboxes.length
      ? []
      : Array.from(checkboxes).map(c => c.value);
  });

  const toggleRecord = $(() => {
    if (!rootRef.value) return;
    const checkboxes = rootRef.value.querySelectorAll('input[type="checkbox"]') as NodeListOf<HTMLInputElement>;
    const result: Record<string, boolean> = {};
    const shouldCheck = Array.from(checkboxes).filter(c => c.checked).length !== checkboxes.length;
    if (!bindValue.value || Object.keys(bindValue.value).length === checkboxes.length) {
      for (const checkbox of checkboxes) {
        const name = checkbox.name.split('.').pop();
        if (name) result[name] = shouldCheck;
      }
    }
    (bindValue.value as Record<string, boolean>) = result;
  });


  const onRecordChange = $(() => {
    if (!rootRef.value) return;
    const checkboxes = rootRef.value.querySelectorAll('input[type="checkbox"]') as NodeListOf<HTMLInputElement>;
    const result: Record<string, boolean> = {}
    for (const checkbox of checkboxes) {
      const name = checkbox.name.split('.').pop();
      if (name) result[name] = checkbox.checked;
    }
    (bindValue.value as Record<string, boolean>) = result;
  });

  const onListChange = $(() => {
    if (!rootRef.value) return;
    const checkboxes = rootRef.value.querySelectorAll('input:checked[type="checkbox"][value]') as NodeListOf<HTMLInputElement>;
    (bindValue.value as string[]) = Array.from(checkboxes).map(c => c.value);
  });

  const onItemChange = $(() => {
    if (!rootRef.value) return;
    const radio = rootRef.value.querySelector('input:checked[value]') as HTMLInputElement;
    (bindValue.value as string) = radio?.value;
  })
  
  const toggleAll = strategy === 'record' ? toggleRecord : toggleList;

  const onValueChange = strategy === 'record' ? onRecordChange
    : strategy === 'list' ? onListChange
    : onItemChange

  useKeyboard(rootRef, disabledKeys, $((event) => {
    const key = event.key;
    if (event.ctrlKey && key === 'a') toggleAll()
    if (key === 'ArrowDown' || key === 'ArrowRight') focusNextInput(rootRef.value!);
    if (key === 'ArrowUp' || key === 'ArrowLeft') focusPreviousInput(rootRef.value!);
    if (event.target instanceof HTMLInputElement) {
      if (key === 'Enter' || key === ' ') event.target.click();
    }
  }));

  const service = {
    rootRef,
    bindValue,
    onValueChange,
    toggleAll,
  };
  useContextProvider(ControlContext, service);
  return service;
}