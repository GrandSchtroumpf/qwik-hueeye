import { Slot, component$, useStyles$, useContextProvider, useSignal, $, useId, useComputed$ } from "@builder.io/qwik";
import { nextFocus, previousFocus, useKeyboard, clsq } from "../../utils";
import { FieldGroupContext, useRecordName } from "../field";
import type { FieldsetAttributes, InputAttributes } from "../types";
import { ControlValueProps, useControlValue, useControlValueProvider } from "../control";
import styles from './switch.scss?inline';

const preventKeys = ['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'ctrl+a'];

interface SwitchGroupProps extends FieldsetAttributes, ControlValueProps<Record<string, boolean>> {}

export const SwitchGroup = component$((props: SwitchGroupProps) => {
  useStyles$(styles);
  useContextProvider(FieldGroupContext, { name: props.name });
  const ref = useSignal<HTMLElement>();

  const { bindValue } = useControlValueProvider(props, {});

  const toggleAll = $(() => {
    const checkboxes = ref.value?.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
    if (!checkboxes) return;
    const result: Record<string, boolean> = {};
    const shouldCheck = Array.from(checkboxes).filter(c => c.checked).length !== checkboxes.length;
    if (!bindValue.value || Object.keys(bindValue.value).length === checkboxes.length) {
      for (const checkbox of checkboxes) {
        const name = checkbox.name.split('.').pop();
        if (name) result[name] = shouldCheck;
      }
    }
    bindValue.value = result;
  });
  useKeyboard(ref, preventKeys, $((event) => {
    const list = ref.value?.querySelectorAll('input[type="checkbox"]') as NodeListOf<HTMLElement>;
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') nextFocus(list);
    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') previousFocus(list);
    if (event.ctrlKey && event.key === 'a') toggleAll();
  }));
  return <fieldset {...props} class={clsq("switch-group", props.class)} ref={ref}>
    <Slot/>
  </fieldset>
});

export type SwitchProps = Omit<InputAttributes, 'type' | 'role' | 'children'>;

export const Switch = component$((props: SwitchProps) => {
  useStyles$(styles);
  const id = useId();
  const fullName = useRecordName(props);
  const keyName = fullName.split('.').pop()!;
  const bindValue = useControlValue<Record<string, boolean>>();
  const checked = useComputed$(() => !!bindValue.value[keyName]);

  const toggle = $(() => {
    bindValue.value = { ...bindValue.value, [keyName]: !checked.value };
  });

  return <div class="switch">
    <input {...props} type="checkbox" role="switch" id={id} name={fullName} checked={checked.value} onClick$={toggle}/>
    <label for={id}>
      <div class="track" aria-hidden="true">
        <span class="thumb"></span>
      </div>
      <Slot />
    </label>
  </div>
})