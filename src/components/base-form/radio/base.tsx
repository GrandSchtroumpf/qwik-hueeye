import { $, component$, createContextId, Slot, useContextProvider, useContext, PropsOf } from "@builder.io/qwik";
import {  WithControl, extractControls, useControl, useControlProvider } from "../control";
import type { InputAttributes, Primitive } from '../types';
import { mergeProps } from "../../utils/attributes";
import { useWithId } from "../../hooks/useWithId";

export type BaseRadioGroupProps = PropsOf<'div'> & {
  toggle?: boolean;
};

const RadioGroupContext = createContextId<{ toggle: boolean }>('RadioGroupContext');
export const BaseRadioGroup = component$<WithControl<Primitive, BaseRadioGroupProps>>((props) => {
  useControlProvider(props);
  const { attr } = extractControls(props);
  const { toggle, ...rest } = attr;
  useContextProvider(RadioGroupContext, { toggle: !!toggle })
  return <div {...rest} role="radiogroup">
    <Slot />
  </div>
});

export interface BaseRadioProps extends InputAttributes {
  value: Primitive;
}

export const BaseRadio = component$<BaseRadioProps>((props) => {
  const id = useWithId(props.id);
  const { value, ...attr } = props;
  const { toggle } = useContext(RadioGroupContext);
  const { control, onChange, name } = useControl();
  const merged = mergeProps<'input'>(attr as any, {
    id,
    type: "radio",
    class: "he-radio-input",
    name: name?.toString(),
    checked: control.value === value,
    onClick$: $(() => {
      if (toggle && control.value === value) onChange(undefined);
    }),
    onChange$: $((e: any, el: HTMLInputElement) => {
      if (el.checked) onChange(value);
    })
  });
  return <>
    <input {...merged} />
    <label for={id}>
      <Slot/>
    </label>
  </>
});

