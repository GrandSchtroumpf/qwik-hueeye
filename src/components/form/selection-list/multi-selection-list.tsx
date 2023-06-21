import type { QwikKeyboardEvent } from "@builder.io/qwik";
import { $, component$, createContextId, Slot, useContext, useContextProvider, useSignal, useId, useVisibleTask$ } from "@builder.io/qwik";
import { FieldContext } from "../field";
import type { FieldProps } from "../field";
import { ArrowsKeys, focusNextInput, focusPreviousInput, nextFocus, previousFocus } from "../../utils";
import type { FieldsetAttributes, UlAttributes } from "../../types";
import type { SelectionItemProps } from "./types";

export interface MultiSelectionGroupProps extends FieldProps, Omit<FieldsetAttributes, 'onKeyDown$'> {}


type MultiSelectionListService = ReturnType<typeof useMultiSelectionList>;

export const MultiSelectionListContext = createContextId<MultiSelectionListService>('MultiSelectionListContext');


export function useMultiSelectionList() {
  const listRef = useSignal<HTMLUListElement>();
  const checkAllRef = useSignal<HTMLInputElement>();

  const updateMode = $(() => {
    if (!listRef.value || !checkAllRef.value) return;
    let allChecked = true;
    let someChecked = false;
    const checkboxes = listRef.value.querySelectorAll('input[type="checkbox"]') as NodeListOf<HTMLInputElement>;
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
  })

  const service = {
    listRef,
    checkAllRef,
    toggleAll: $(() => {
      if (!listRef.value) return;
      const checkboxes = listRef.value.querySelectorAll('input[type="checkbox"]') as NodeListOf<HTMLInputElement>;
      let amount = 0;
      for (const checkbox of checkboxes) {
        if (checkbox.checked) amount++;
      }
      const shouldCheckAll = amount !== checkboxes.length;
      for (const checkbox of checkboxes) checkbox.checked = shouldCheckAll;
      updateMode();
    }),
    updateMode,
    next: $(() => focusNextInput(listRef.value!)),
    previous: $(() => focusPreviousInput(listRef.value!)),
  };
  useContextProvider(MultiSelectionListContext, service);
  return service;
}


export const MultiSelectionGroup = component$((props: MultiSelectionGroupProps) => {  
  return <fieldset {...props}>
    <Slot />
  </fieldset>
});


const disabledKeys = [...ArrowsKeys, 'Enter'];
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