import { Slot, component$, useStyles$ } from "@builder.io/qwik";
import { BaseRadio, BaseRadioGroup, BaseRadioGroupProps, BaseRadioProps } from "./base";
import { mergeProps } from "../../utils/attributes";
import { WithControl } from "../control";
import { Primitive } from "../types";
import styles from './radio.scss?inline';

export const RadioGroup = component$<WithControl<Primitive, BaseRadioGroupProps>>((props) => {
  useStyles$(styles);
  const merged = mergeProps<'div'>(props, { class: 'he-radio-group' });
  return <BaseRadioGroup {...merged}>
    <Slot />
  </BaseRadioGroup>
});


export const Radio = component$((props: BaseRadioProps) => {
  useStyles$(styles);
  return <div class="he-radio">
    <BaseRadio {...props}>
      <svg focusable="false" viewBox="0 0 24 24" aria-hidden="true">
        <circle r="8" cx="12" cy="12"/>
      </svg>
      <Slot/>
    </BaseRadio>
  </div>
});