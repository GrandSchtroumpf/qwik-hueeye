import { component$, Slot, useComputed$, useContextProvider, useId, useStyles$ } from "@builder.io/qwik";
import { FieldGroupContext, useGroupName, useNameId } from '../field';
import type { FieldsetAttributes, InputAttributes } from "../../types";
import { clsq } from '../../utils';
import { ControlValueProps, extractControlProps, useControlValue, useControlItemProvider } from "../control";
import styles from './radio.scss?inline';

export interface RadioGroupProps extends Omit<FieldsetAttributes, 'role'>, ControlValueProps<string | string[]> {}

// TODO: Don't use control provider for radio group has it override the Arrow behavior
export const RadioGroup = component$((props: RadioGroupProps) => {
  const name = useNameId(props);
  useContextProvider(FieldGroupContext, { name });
  const {rootRef, onValueChange} = useControlItemProvider(props);
  const attr = extractControlProps(props);

  return <fieldset {...attr} ref={rootRef} name={name} onChange$={onValueChange} class={clsq("radio-group", props.class)} role="radiogroup">
    <Slot />
  </fieldset>
});


type RadioProps = Omit<InputAttributes, 'id' | 'type' | 'children'>;
export const Radio = component$((props: RadioProps) => {
  useStyles$(styles);
  const id = useId();
  const name = useGroupName(props);
  const value = props.value as string;
  const {bindValue} = useControlValue<string>();
  const checked = useComputed$(() => bindValue.value === value);

  return <div class="radio-item">
    <input id={id} type="radio" {...props} name={name} value={value} checked={checked.value}/>
    <label for={id}>
      <svg focusable="false" viewBox="0 0 24 24" aria-hidden="true">
        <circle r="8" cx="12" cy="12"/>
      </svg>
      <Slot/>
    </label>
  </div>
});