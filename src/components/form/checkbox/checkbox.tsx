import { component$, Slot, useStyles$, useId } from "@builder.io/qwik";
import type { InputAttributes } from "../types";
import styles from './checkbox.scss?inline';

interface CheckboxProps extends Omit<InputAttributes, 'type' | 'children'> {}

export const Checkbox = component$((props: CheckboxProps) => {
  useStyles$(styles);
  const id = useId();
  return <div class="checkbox">
    <input id={id} type="checkbox" {...props} />
    <label for={id}>
      <svg focusable="false" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="none"></path>
      </svg>
      <Slot/>
    </label>
  </div>
})