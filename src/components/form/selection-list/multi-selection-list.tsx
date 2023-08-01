import type { QwikKeyboardEvent } from "@builder.io/qwik";
import { $, component$, createContextId, Slot, useContext, useContextProvider, useSignal, useId, useVisibleTask$ } from "@builder.io/qwik";
import { FieldContext } from "../field";
import type { FieldProps } from "../field";
import { ArrowsKeys, focusNextInput, focusPreviousInput, nextFocus, previousFocus, useKeyboard } from "../../utils";
import type { FieldsetAttributes, UlAttributes } from "../../types";
import type { SelectionItemProps } from "./types";

export interface MultiSelectionGroupProps extends FieldProps, Omit<FieldsetAttributes, 'onKeyDown$'> {}


type MultiSelectionListService = ReturnType<typeof useMultiSelectionList>;

export const MultiSelectionListContext = createContextId<MultiSelectionListService>('MultiSelectionListContext');



const disabledKeys = [...ArrowsKeys, 'Enter', ' ', 'ctrl+a'];
export function useMultiSelectionList() {
  const rootRef = useSignal<HTMLElement>();
  const checkAllRef = useSignal<HTMLInputElement>();

  const updateMode = $(() => {
    if (!rootRef.value || !checkAllRef.value) return;
    let allChecked = true;
    let someChecked = false;
    const checkboxes = rootRef.value.querySelectorAll('input[type="checkbox"]') as NodeListOf<HTMLInputElement>;
    for (const checkbox of checkboxes) {
      checkbox.checked
        ? someChecked = true
        : allChecked = false;
      if (someChecked && !allChecked) break;
    }
    if (allChecked) {
      checkAllRef.value.checked = true;
      checkAllRef.value.indeterminate = false;
    } else {
      checkAllRef.value.checked = false;
      checkAllRef.value.indeterminate = someChecked;
    }
  });

  const toggleAll = $(() => {
    if (!rootRef.value) return;
    const checkboxes = rootRef.value.querySelectorAll('input[type="checkbox"][value]') as NodeListOf<HTMLInputElement>;
    let amount = 0;
    for (const checkbox of checkboxes) {
      if (checkbox.checked) amount++;
    }
    const shouldCheckAll = amount !== checkboxes.length;
    for (const checkbox of checkboxes) checkbox.checked = shouldCheckAll;
    updateMode();
  })
  
  useKeyboard(rootRef, disabledKeys, $((event) => {
    const key = event.key;
    if (event.ctrlKey && key === 'a') toggleAll();
    if (key === 'ArrowDown' || key === 'ArrowRight') focusNextInput(rootRef.value!);
    if (key === 'ArrowUp' || key === 'ArrowLeft') focusPreviousInput(rootRef.value!);
    if (event.target instanceof HTMLInputElement) {
      if (key === 'Enter' || key === ' ') event.target.click();
    }
  }));


  const service = {
    rootRef,
    checkAllRef,
    toggleAll,
    updateMode,
    next: $(() => focusNextInput(rootRef.value!)),
    previous: $(() => focusPreviousInput(rootRef.value!)),
  };
  useContextProvider(MultiSelectionListContext, service);
  return service;
}


export const MultiSelectionGroup = component$((props: MultiSelectionGroupProps) => {  
  return <fieldset {...props}>
    <Slot />
  </fieldset>
});


export const MultiSelectionList = component$((props: UlAttributes) => {
  const ref = useSignal<HTMLElement>();
  const toggleAll = $(() => {
    if (!ref.value) return;
    const checkboxes = ref.value.querySelectorAll('input[type="checkbox"]') as NodeListOf<HTMLInputElement>;
    let amount = 0;
    for (const checkbox of checkboxes) {
      if (checkbox.checked) amount++;
    }
    const shouldCheckAll = amount !== checkboxes.length;
    for (const checkbox of checkboxes) checkbox.checked = shouldCheckAll;
  });

  const next = $(() => nextFocus(ref.value?.querySelectorAll<HTMLElement>('input[type="checkbox"]')));
  const previous = $(() => previousFocus(ref.value?.querySelectorAll<HTMLElement>('input[type="checkbox"]')));

  // Prevent default behavior
  useVisibleTask$(() => {
    const handler = (event: KeyboardEvent) => {
      if (disabledKeys.includes(event.key)) event.preventDefault();
    }
    ref.value?.addEventListener('keydown', handler);
    return () => ref.value?.removeEventListener('keydown', handler);
  });

  // Create new behavior
  const onKeyDown$ = $((event: QwikKeyboardEvent<HTMLElement>) => {
    const key = event.key;
    if (event.ctrlKey && key === 'a') toggleAll();
    if (key === 'ArrowDown' || key === 'ArrowRight') next();
    if (key === 'ArrowUp' || key === 'ArrowLeft') previous();
    if (key === 'Enter') {
      const active = document.activeElement as HTMLInputElement
      active.checked = !active.checked;
    }
  });

  return <ul {...props} ref={ref} onKeyDown$={onKeyDown$} aria-multiselectable="true">
    <Slot />
  </ul>
});


export const MultiSelectionItem = component$((props: SelectionItemProps) => {
  const id = useId();
  const { name, change } = useContext(FieldContext);
  
  return <li {...props}>
    <input id={id} type="checkbox" name={name} value={props.value} onChange$={change} />
    <label for={id}>
      <Slot/>
    </label>
  </li>
});