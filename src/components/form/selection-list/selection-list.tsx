import { $, component$, Slot, useContext, useId, useSignal, useContextProvider, createContextId } from "@builder.io/qwik";
import { FieldContext } from "../field";
import type { FieldProps } from "../field";
import type { FieldsetAttributes, UlAttributes } from "../../types";
import type { SelectionItemProps } from "./types";
import { nextFocus, previousFocus } from "../../utils";

export interface SelectionGroupProps extends FieldProps, Omit<FieldsetAttributes, 'role' | 'tabIndex' | 'onKeyDown$'> {}

export type SelectionListService = ReturnType<typeof useSelectionList>;
export const SelectionListContext = createContextId<SelectionListService>('SelectionListContext');
export function useSelectionList() {
  const listRef = useSignal<HTMLUListElement>();
  const service = {
    listRef,
    next: $(() => nextFocus(listRef.value?.querySelectorAll<HTMLElement>('input[type="radio"]'))),
    previous: $(() => previousFocus(listRef.value?.querySelectorAll<HTMLElement>('input[type="radio"]'))),
  };
  useContextProvider(SelectionListContext, service);
  return service;
}


export const SelectionGroup = component$((props: SelectionGroupProps) => {
  return <fieldset {...props} role="radiogroup">
    <Slot />
  </fieldset>
});

export type SelectionListProps = UlAttributes;
export const SelectionList = component$((props: SelectionListProps) => {
  return <ul {...props} aria-multiselectable="false">
    <Slot />
  </ul>
});


export const SelectionItem = component$((props: SelectionItemProps) => {
  const id = useId();
  const mode = props.mode || 'radio';
  const { name, change } = useContext(FieldContext);
  
  const toggle = $((event: any, el: HTMLInputElement) => {
    if (mode === 'radio') return;
    el.checked = !el.checked;
    change(event, el);
  });

  return <li {...props}>
    <input id={id} type="radio" name={name} value={props.value} onChange$={change} onClick$={toggle} />
    <label for={id}>
      <Slot/>
    </label>
  </li>
});