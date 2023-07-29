import { $, component$, QwikChangeEvent, Slot, useComputed$, useContextProvider, useId, useStyles$ } from "@builder.io/qwik";
import { FieldGroupContext, useGroupName } from '../field';
import type { FieldsetAttributes, InputAttributes } from "../../types";
import { clsq } from '../../utils';
import { ControlValueProps, extractControlProps, useControlValue, useControlValueProvider } from "../control";
import styles from './radio.scss?inline';

export interface RadioGroupProps extends Omit<FieldsetAttributes, 'role'>, ControlValueProps<string | string[]> {}


export const RadioGroup = component$((props: RadioGroupProps) => {
  useContextProvider(FieldGroupContext, { name: props.name });
  const bindValue = useControlValueProvider(props);
  const attr = extractControlProps(props);

  const changeValue = $((event: QwikChangeEvent) => {
    bindValue.value = (event.target as HTMLInputElement).value;
  });

  return <fieldset {...attr} onChange$={changeValue} class={clsq("radio-group", props.class)} role="radiogroup">
    <Slot />
  </fieldset>
});


type RadioProps = Omit<InputAttributes, 'type' | 'children'>;
export const Radio = component$((props: RadioProps) => {
  useStyles$(styles);
  const id = useId();
  const name = useGroupName(props);
  const value = props.value as string;
  const bindValue = useControlValue<string>();
  const checked = useComputed$(() => bindValue.value === value);

  return <div class="radio-item">
    <input id={id} type="radio" {...props} name={name} value={value} bind:checked={checked}/>
    <label for={id}>
      <svg focusable="false" viewBox="0 0 24 24" aria-hidden="true">
        <circle r="8" cx="12" cy="12"/>
      </svg>
      <Slot/>
    </label>
  </div>
});