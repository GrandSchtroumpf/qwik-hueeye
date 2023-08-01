import { Slot, component$, useStyles$, useContextProvider, useId, useComputed$ } from "@builder.io/qwik";
import { clsq } from "../../utils";
import { FieldGroupContext, useRecordName } from "../field";
import type { FieldsetAttributes, InputAttributes } from "../types";
import { ControlValueProps, useControlProvider, useControlValue } from "../control";
import styles from './switch.scss?inline';

interface SwitchGroupProps extends FieldsetAttributes, ControlValueProps<Record<string, boolean>> {}

export const SwitchGroup = component$((props: SwitchGroupProps) => {
  useStyles$(styles);
  useContextProvider(FieldGroupContext, { name: props.name });
  const { rootRef, onValueChange } = useControlProvider('record', props);

  return <fieldset {...props} onChange$={onValueChange} class={clsq("switch-group", props.class)} ref={rootRef}>
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

  return <div class="switch">
    <input {...props} type="checkbox" role="switch" id={id} name={fullName} checked={checked.value}/>
    <label for={id}>
      <div class="track" aria-hidden="true">
        <span class="thumb"></span>
      </div>
      <Slot />
    </label>
  </div>
})