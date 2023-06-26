import { Slot, component$, useStyles$, useContextProvider, useSignal, $, useId } from "@builder.io/qwik";
import { nextFocus, previousFocus, useKeyboard, clsq } from "../../utils";
import { FieldGroupContext, useRecordName } from "../field";
import { useFormValue } from "../form";
import type { FieldsetAttributes, InputAttributes } from "../types";
import styles from './switch.scss?inline';

const preventKeys = ['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'ctrl+a'];

interface SwitchGroupProps extends FieldsetAttributes {}

export const SwitchGroup = component$((props: SwitchGroupProps) => {
  useStyles$(styles);
  useContextProvider(FieldGroupContext, { name: props.name });

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
  const name = useRecordName(props);
  const initialChecked = !!useFormValue<string | string[]>(name);

  return <div class="switch">
    <input {...props} type="checkbox" role="switch" id={id} name={name} checked={initialChecked}/>
    <label for={id}>
      <div class="track" aria-hidden="true">
        <span class="thumb"></span>
      </div>
      <Slot />
    </label>
  </div>
})