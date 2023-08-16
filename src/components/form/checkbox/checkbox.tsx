import { component$, Slot, useStyles$, useId, useComputed$ } from "@builder.io/qwik";
import type { InputAttributes } from "../types";
import styles from './checkbox.scss?inline';
import { useGroupName } from "../field";
import { useControlValue } from "../control";

interface CheckboxProps extends Omit<InputAttributes, 'type' | 'children'> {
  value?: string;
}

export const Checkbox = component$((props: CheckboxProps) => {
  useStyles$(styles);
  const id = useId();
  const name = useGroupName(props);
  const value = props.value;
  const {bindValue} = useControlValue<string[]>();
  const checked = useComputed$(() => !!value && bindValue.value.includes(value));

  return <div class="checkbox">
    <input {...props} name={name} id={id} checked={checked.value} type="checkbox"/>
    <label for={id}>
      <svg focusable="false" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="none"></path>
      </svg>
      <Slot/>
    </label>
  </div>
})
