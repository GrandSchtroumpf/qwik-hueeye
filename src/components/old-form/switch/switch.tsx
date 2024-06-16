import { Slot, component$, useStyles$, useContextProvider, useId, useComputed$ } from "@builder.io/qwik";
import { clsq } from "../../utils";
import { FieldGroupContext, useRecordName } from "../field";
import type { FieldsetAttributes, InputAttributes } from "../types";
import { ControlValueProps, extractControlProps, useControlItemProvider, useControlRecordProvider, useControlValue } from "../control";
import styles from './switch.scss?inline';

interface SwitchGroupProps extends FieldsetAttributes, ControlValueProps<Record<string, boolean>> {}

export const SwitchGroup = component$((props: SwitchGroupProps) => {
  useStyles$(styles);
  useContextProvider(FieldGroupContext, { name: props.name });
  const { rootRef, onValueChange } = useControlRecordProvider(props);

  return <fieldset {...props} onChange$={onValueChange} class={clsq("switch-group", props.class)} ref={rootRef}>
    <Slot/>
  </fieldset>
});

export type InputSwitchProps = Omit<InputAttributes, 'type' | 'role' | 'children' | 'bind:value'>;

export const SwitchItem = component$((props: InputSwitchProps) => {
  useStyles$(styles);
  const id = useId();
  const fullName = useRecordName(props);
  const keyName = fullName.split('.').pop()!;
  const {bindValue} = useControlValue<Record<string, boolean>>();
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
});

export interface SwitchProps extends Omit<InputSwitchProps, 'value'>, ControlValueProps<boolean> {}

export const Switch = component$((props: SwitchProps) => {
  useStyles$(styles);
  const {onValueChange} = useControlItemProvider<boolean>(props, !!props.checked);
  const attr = extractControlProps(props);
  return <InnerSwitch {...attr} onChange$={(e, i) => onValueChange(i.checked)}>
    <Slot />
  </InnerSwitch>
});


const InnerSwitch = component$((props: InputSwitchProps) => {
  const baseId = useId();
  const id = props.id ?? baseId;

  return <div class="switch">
    <input {...props} type="checkbox" role="switch" id={id}/>
    <label for={id}>
      <div class="track" aria-hidden="true">
        <span class="thumb"></span>
      </div>
      <Slot />
    </label>
  </div>
})
