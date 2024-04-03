import { Slot, component$, useStyles$ } from "@builder.io/qwik";
import { BaseCheckFieldset, BaseCheckFieldsetProps, BaseCheckGroup, BaseCheckGroupProps, BaseCheckbox, BaseCheckboxProps } from "./base";
import styles from './switch.scss?inline';

const SwitchThumb = () => (
  <div class="track" aria-hidden="true">
    <span class="thumb"></span>
  </div>
)

export const SwitchFieldset = component$<BaseCheckFieldsetProps>((props) => {
  useStyles$(styles);
  return <BaseCheckFieldset {...props} class="he-switch-fieldset">
    <Slot/>
  </BaseCheckFieldset>
});

export const SwitchGroup = component$<BaseCheckGroupProps>((props) => {
  useStyles$(styles);
  return <BaseCheckGroup {...props} class="he-switch-group">
    <Slot/>
  </BaseCheckGroup>
});

export const Switch = component$<BaseCheckboxProps>((props) => {
  useStyles$(styles);
  return <div class="he-switch">
    <BaseCheckbox {...props}>
      <SwitchThumb />
      <Slot/>
    </BaseCheckbox>
  </div>
});