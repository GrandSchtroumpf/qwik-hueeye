import { component$, Slot, useStyles$, useId } from "@builder.io/qwik";
import { useFormValue } from "../form";
import type { InputAttributes } from "../types";
import styles from './checkbox.scss?inline';

interface CheckboxProps extends Omit<InputAttributes, 'type' | 'children'> {}

export const Checkbox = component$((props: CheckboxProps) => {
  useStyles$(styles);
  const id = useId();
  const initialValue = useFormValue<string>(props.name);
  const initialChecked = !!initialValue && initialValue === props.value;

  return <div class="checkbox">
    <input {...props} id={id} type="checkbox" checked={initialChecked}/>
    <label for={id}>
      <svg focusable="false" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="none"></path>
      </svg>
      <Slot/>
    </label>
  </div>
})