import { component$, Slot, useComputed$, useContext, useContextProvider, useId, useSignal, useStyles$, useVisibleTask$ } from "@builder.io/qwik";
import { FieldGroupContext, useGroupName } from "../field";
import type { FieldsetAttributes, InputAttributes, UlAttributes } from "../../types";
import { clsq } from "../../utils";
import { ControlContext, ControlValueProps, extractControlProps, useControlProvider, useControlValue } from "../control";
import styles from './checkbox.scss?inline';

export interface CheckgroupProps extends Omit<FieldsetAttributes, 'role' | 'tabIndex' | 'onKeyDown$'>, ControlValueProps<string[]> {}

export const CheckGroup = component$((props: CheckgroupProps) => {
  useStyles$(styles);
  const { rootRef, onValueChange } = useControlProvider('list', props);
  const attr = extractControlProps(props);
  
  useContextProvider(FieldGroupContext, { name: props.name });

  return <fieldset {...attr} ref={rootRef} onChange$={onValueChange} class={clsq('check-group', props.class)} >
    <Slot />
  </fieldset>
})


export const CheckAll = component$(() => {
  const checkAllRef = useSignal<HTMLInputElement>();
  const { rootRef, bindValue, toggleAll } = useContext(ControlContext);
  // If there is an initialValue, verify the mode of the checkAll element
  useVisibleTask$(({ track }) => {
    track(() => bindValue.value);
    if (!checkAllRef.value || !rootRef.value) return;
    if (!bindValue.value?.length) {
      checkAllRef.value.indeterminate = false;
      checkAllRef.value.checked = false;
    } else {
      const all = rootRef.value.querySelectorAll('input[value]');
      checkAllRef.value.indeterminate = all.length !== bindValue.value.length;
      checkAllRef.value.checked = all.length === bindValue.value.length;
    }
  });
  useStyles$(styles);
  const id = useId();

  return <div class="checkbox">
    {/* Prevent default the click to avoid onchange trigger on the fieldset */}
    <input class="check-all" ref={checkAllRef} onClick$={toggleAll} preventdefault:click id={id} type="checkbox"/>
    <label for={id}>
      <svg focusable="false" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="none"></path>
      </svg>
      <Slot/>
    </label>
  </div>
})

export const CheckList = component$((props: UlAttributes) => {
  return <ul class="check-list" {...props}>
    <Slot />
  </ul>
})

interface CheckItemProps extends Omit<InputAttributes, 'type' | 'children'>{
  value: string;
}

export const CheckItem = component$((props: CheckItemProps) => {
  const id = useId();
  const name = useGroupName(props);
  const value = props.value;
  const bindValue = useControlValue<string[]>();
  const checked = useComputed$(() => !!value && bindValue.value.includes(value));

  return <li class="check-item">
    <input class="checkbox-input" {...props} name={name} id={id} checked={checked.value} type="checkbox"/>
    <label class="checkbox-label" for={id}>
      <svg focusable="false" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="none"></path>
      </svg>
      <Slot/>
    </label>
  </li>;
})