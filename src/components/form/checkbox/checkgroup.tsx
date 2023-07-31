import { $, component$, QwikChangeEvent, Slot, useComputed$, useContext, useContextProvider, useId, useSignal, useStyles$, useVisibleTask$ } from "@builder.io/qwik";
import { Checkbox } from "./checkbox";
import { useMultiSelectionList, MultiSelectionListContext } from '../selection-list/multi-selection-list';
import { FieldGroupContext, useGroupName } from "../field";
import type { FieldsetAttributes, InputAttributes, UlAttributes } from "../../types";
import { ArrowsKeys, useKeyboard, clsq } from "../../utils";
import { ControlValueProps, extractControlProps, useControlValue, useControlValueProvider } from "../control";
import styles from './checkbox.scss?inline';

export interface CheckgroupProps extends Omit<FieldsetAttributes, 'role' | 'tabIndex' | 'onKeyDown$'>, ControlValueProps<string[]> {}

const disabledKeys = [...ArrowsKeys, 'Enter', 'ctrl+a'];
export const CheckGroup = component$((props: CheckgroupProps) => {
  useStyles$(styles);
  const root = useSignal<HTMLElement>();
  const lastActive = useSignal<HTMLElement | null>();
  const { checkAllRef, toggleAll, next, previous } = useMultiSelectionList();

  const {bindValue} = useControlValueProvider(props);
  const attr = extractControlProps(props);

  const changeValue = $((event: QwikChangeEvent, fieldset: HTMLFieldSetElement) => {
    const inputs = fieldset.querySelectorAll('input');
    bindValue.value = Array.from(inputs).filter(i => i.checked && i.value).map(i => i.value);
  });

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
      if (key === 'Enter') event.target.click();
    }
  }));

  return <fieldset {...attr} ref={root} onChange$={changeValue} class={clsq('check-group', props.class)} >
    <Slot />
  </fieldset>
})


export const CheckAll = component$(() => {
  const { checkAllRef, toggleAll, updateMode } = useContext(MultiSelectionListContext);
  
  // If there is an initialValue, verify the mode of the checkAll element
  useVisibleTask$(() => updateMode());
  
  return <Checkbox value="" class="check-all" ref={checkAllRef} onClick$={toggleAll}>
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
  const name = useGroupName(props);
  const value = props.value;
  const bindValue = useControlValue<string[]>();
  const checked = useComputed$(() => !!value && bindValue.value.includes(value));

  return <li class="check-item">
    <input class="checkbox-input" {...props} name={name} id={id} checked={checked.value} type="checkbox" onChange$={updateMode}/>
    <label class="checkbox-label" for={id}>
      <svg focusable="false" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="none"></path>
      </svg>
      <Slot/>
    </label>
  </li>;
})