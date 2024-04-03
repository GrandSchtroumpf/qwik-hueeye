import { Slot, component$, useStyles$ } from "@builder.io/qwik";
import { BaseRadioGroup, BaseRadioGroupProps, BaseRadio, BaseRadioProps } from "./base";
import { mergeProps } from "../../utils/attributes";
import { WithControl } from "../control";
import { Primitive } from "../types";
import styles from './toggle.scss?inline';

export const ToggleGroup = component$<WithControl<Primitive, BaseRadioGroupProps>>((props) => {
  useStyles$(styles);
  const merged = mergeProps<'div'>(props, { class: 'he-toggle-group' });
  return <BaseRadioGroup {...merged} toggle>
    <Slot />
  </BaseRadioGroup>
});

export const Toggle = component$<BaseRadioProps>((props) => {
  useStyles$(styles);
  return <div class="he-toggle">
    <BaseRadio {...props}>
      <Slot/>
    </BaseRadio>
  </div>
});