import { QRL, Signal, createContextId, useContext, useContextProvider, useSignal, $, useVisibleTask$, useTask$, untrack } from "@builder.io/qwik";
import { useForm } from "./form";
import { useOnChange } from "qwik-hueeye";
import { ArrowsKeys, focusNextInput, focusPreviousInput, useKeyboard } from "../utils";
import { getDeepValue, setDeepValue } from "./utils";

export interface ControlValueProps<T> {
  required?: boolean;
  name?: string;
  value?: T;
  'bind:value'?: Signal<T | undefined>;
  onValueChange$?: QRL<(value: T) => any>;
}

interface ControlValue<T> {
  bindValue: Signal<T>;
  initialValue: T;
}

export const ControlValueContext = createContextId<ControlValue<any>>('ControlValueContext');
export function useControlValue<T>() {
  return useContext<ControlValue<T>>(ControlValueContext)
}

export const extractControlProps = <T extends ControlValueProps<any>>(props: T) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { name, value, 'bind:value': bindValue, onValueChange$, ...attr} = props;
  return attr;
}


const disabledKeys = [...ArrowsKeys, 'Enter', ' ', 'ctrl+a'];

export function useControllerProvider<T>(props: ControlValueProps<T>, initial?: T) {
  const { formRef, value, bindValue: formBindValue } = useForm();

  // TODO: find the best way to handle initial value from the form
  const initialValue = props.value ?? getDeepValue(untrack(() => value), props.name) ?? initial ?? '' as T;
  const signalValue = useSignal<T>(initialValue);

  // TODO: only use bind value when user wants one
  const bindValue = props["bind:value"] ?? signalValue;  

  // Update control on form value changes
  useTask$(({ track }) => {
    if (!formRef.value) return;
    // TODO: maybe use a store for formBindValue to avoid JSON.stringify comparison
    // TODO: check if name is in form
    const change = track(() => getDeepValue(formBindValue.value, props.name));
    if (JSON.stringify(change) === JSON.stringify(bindValue.value)) return;
    bindValue.value = change as any;
  });


  // Update control on form reset
  useVisibleTask$(() => {
    const handler = (event: Event) => {
      event.preventDefault();
      bindValue.value = initialValue;
    }
    formRef.value?.addEventListener('reset', handler);
    return () => formRef.value?.removeEventListener('reset', handler);
  });

  // Forward changes
  useOnChange(bindValue, $((change) => {
    if (props.name && formRef.value) {
      const old = structuredClone(formBindValue.value);
      setDeepValue(old, props.name, change);
      formBindValue.value = old;
    }
    if (typeof change !== 'undefined' && props.onValueChange$) props.onValueChange$(change);
  }));

  useContextProvider(ControlValueContext, { bindValue, initialValue });
  return { bindValue, initialValue };
}

type ControlRecord<T> = ReturnType<typeof useControlRecordProvider<T>>;
export const ControlRecordContext = createContextId<ControlRecord<any>>('ControlRecordContext');
export function useControlRecord<T>() {
  return useContext<ControlRecord<T>>(ControlRecordContext);
}
export function useControlRecordProvider<T>(
  props: ControlValueProps<Record<string, T>>,
  initial: Record<string, T> = {},
) {
  const rootRef = useSignal<HTMLElement>();
  const { bindValue, initialValue } = useControllerProvider<Record<string, T>>(props, initial);
  const toggleAll = $(() => {
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

  const onValueChange = $(() => {
    if (!rootRef.value) return;
    const checkboxes = rootRef.value.querySelectorAll('input[type="checkbox"]') as NodeListOf<HTMLInputElement>;
    const result: Record<string, boolean> = {}
    for (const checkbox of checkboxes) {
      const name = checkbox.name.split('.').pop();
      if (name) result[name] = checkbox.checked;
    }
    (bindValue.value as Record<string, boolean>) = result;
  });


  useKeyboard(rootRef, disabledKeys, $((event) => {
    const key = event.key;
    if (event.ctrlKey && key === 'a') toggleAll()
    if (key === 'ArrowDown' || key === 'ArrowRight') focusNextInput(rootRef.value!);
    if (key === 'ArrowUp' || key === 'ArrowLeft') focusPreviousInput(rootRef.value!);
    if (event.target instanceof HTMLInputElement) {
      if (key === 'Enter' || key === ' ') event.target.click();
    }
  }));

  const controlRecord = {
    rootRef,
    toggleAll,
    onValueChange,
    bindValue,
    initialValue,
  };
  useContextProvider(ControlRecordContext, controlRecord);
  return controlRecord;
}

type ControlList<T> = ReturnType<typeof useControlListProvider<T>>;
export const ControlListContext = createContextId<ControlList<any>>('ControlListContext');
export function useControlList<T>() {
  return useContext<ControlList<T>>(ControlListContext);
}
export function useControlListProvider<T>(
  props: ControlValueProps<T[]>,
  initial: T[] = [],
) {
  const rootRef = useSignal<HTMLElement>();
  const { bindValue, initialValue } = useControllerProvider<T[]>(props, initial);

  const toggleAll = $(() => {
    if (!rootRef.value) return;
    const checkboxes = rootRef.value.querySelectorAll('input[type="checkbox"][value]') as NodeListOf<HTMLInputElement>;
    (bindValue.value as string[]) = bindValue.value?.length === checkboxes.length
      ? []
      : Array.from(checkboxes).map(c => c.value);
  });

  const onValueChange = $(() => {
    if (!rootRef.value) return;
    const checkboxes = rootRef.value.querySelectorAll('input:checked[type="checkbox"][value]') as NodeListOf<HTMLInputElement>;
    (bindValue.value as string[]) = Array.from(checkboxes).map(c => c.value);
  });

  useKeyboard(rootRef, disabledKeys, $((event) => {
    const key = event.key;
    if (event.ctrlKey && key === 'a') toggleAll()
    if (key === 'ArrowDown' || key === 'ArrowRight') focusNextInput(rootRef.value!);
    if (key === 'ArrowUp' || key === 'ArrowLeft') focusPreviousInput(rootRef.value!);
    if (event.target instanceof HTMLInputElement) {
      if (key === 'Enter' || key === ' ') event.target.click();
    }
  }));
  const controlList = {
    rootRef,
    toggleAll,
    onValueChange,
    bindValue,
    initialValue,
  };

  useContextProvider(ControlListContext, controlList);
  return controlList;
}

type ControlItem<T> = ReturnType<typeof useControlItemProvider<T>>;
export const ControlItemContext = createContextId<ControlItem<any>>('ControlItemContext');
export function useControlItem<T>() {
  return useContext<ControlItem<T>>(ControlItemContext);
}
export function useControlItemProvider<T>(
  props: ControlValueProps<T>,
  initial?: T,
) {
  const rootRef = useSignal<HTMLElement>();
  const { bindValue, initialValue } = useControllerProvider<T>(props, initial);
  const onValueChange = $(() => {
    if (!rootRef.value) return;
    const radio = rootRef.value.querySelector('input:checked[value]') as HTMLInputElement;
    (bindValue.value as string) = radio?.value;
  });

  const controlItem = {
    rootRef,
    bindValue,
    initialValue,
    onValueChange
  };
  useContextProvider(ControlItemContext, controlItem);
  return controlItem;
}
