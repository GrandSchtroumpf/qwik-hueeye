import { $, component$, Slot, useContext, useContextProvider, useId, useSignal, useStyles$ } from "@builder.io/qwik";
import { Checkbox } from "./checkbox";
import { useMultiSelectionList, MultiSelectionListContext } from '../selection-list/multi-selection-list';
import type { FieldProps} from "../field";
import { FieldGroupContext, useGroupName } from "../field";
import type { MultiSelectionGroupProps} from '../selection-list/multi-selection-list';
import type { FieldsetAttributes, InputAttributes, UlAttributes } from "../../types";
import { ArrowsKeys, useKeyboard, clsq } from "../../utils";
import styles from './checkbox.scss?inline';

export interface CheckgroupProps extends FieldProps, Omit<FieldsetAttributes, 'role' | 'tabIndex' | 'onKeyDown$'> {}

const disabledKeys = [...ArrowsKeys, 'Enter', 'ctrl+a'];
export const CheckGroup = component$((props: MultiSelectionGroupProps) => {
  useStyles$(styles);
  const root = useSignal<HTMLElement>();
  const lastActive = useSignal<HTMLElement | null>();
  const { checkAllRef, toggleAll, next, previous } = useMultiSelectionList();

  useContextProvider(FieldGroupContext, { name: props.name });

  useKeyboard(root, disabledKeys, $((event) => {
    const key = event.key;
    if (event.ctrlKey && key === 'a') toggleAll();
    if (key === 'ArrowDown') next();
    if (key === 'ArrowUp') previous();
    if (key === 'ArrowLeft') {
      lastActive.value = document.activeElement as HTMLElement;
      checkAllRef.value?.focus();
    }
    if (key === 'ArrowRight') {
      (lastActive.value) ? lastActive.value.focus() : next();
    }
    if (event.target instanceof HTMLInputElement) {
      const radio = event.target;
      if (key === 'Enter') radio.checked = !radio.checked;
    }
  }));

  return <fieldset {...props} ref={root} class={clsq('check-group', props.class)} >
    <Slot />
  </fieldset>
})


export const CheckAll = component$(() => {
  const { checkAllRef, toggleAll } = useContext(MultiSelectionListContext);
  return <Checkbox class="check-all" ref={checkAllRef} onChange$={toggleAll}>
    <Slot />
  </Checkbox>
})

export const CheckList = component$((props: UlAttributes) => {
  const { listRef } = useContext(MultiSelectionListContext);
  return <ul class="check-list" ref={listRef} {...props}>
    <Slot />
  </ul>
})

interface CheckItemProps extends Omit<InputAttributes, 'type' | 'children'>{
  value: string;
}

export const CheckItem = component$((props: CheckItemProps) => {
  const { updateMode } = useContext(MultiSelectionListContext);
  const id = useId();
  const nameId = useGroupName(props);
  
  return <li class="check-item">
    <input class="checkbox-input" {...props} name={nameId} id={id} type="checkbox" onChange$={updateMode}/>
    <label class="checkbox-label" for={id}>
      <svg focusable="false" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="none"></path>
      </svg>
      <Slot/>
    </label>
  </li>
})