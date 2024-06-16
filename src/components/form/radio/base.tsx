import { $, component$, createContextId, Slot, useContextProvider, useContext, PropsOf, sync$ } from "@builder.io/qwik";
import {  WithControl, extractControls, useControl, useControlProvider } from "../control";
import type { InputAttributes, Primitive } from '../types';
import { mergeProps } from "../../utils/attributes";
import { useWithId } from "../../hooks/useWithId";
import { focusInInputList, focusOutInputList } from "../utils";
import { focusList } from '../../list/utils';

export type BaseRadioGroupProps = PropsOf<'div'> & {
  toggle?: boolean;
};

const disableKeyDown = sync$((e: KeyboardEvent) => {
  const keys = ['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft', 'Home', 'End', 'Enter', ' '];
  if (keys.includes(e.key)) e.preventDefault();
})
const radioKeyDown = $((e: KeyboardEvent, el: HTMLElement) => focusList('input', e, el));

const RadioGroupContext = createContextId<{ toggle: boolean, groupId: string }>('RadioGroupContext');
export const BaseRadioGroup = component$<WithControl<Primitive, BaseRadioGroupProps>>((props) => {
  const id = useWithId(props.id);
  useControlProvider(props);
  const { attr } = extractControls(props);
  const { toggle, ...rest } = attr;
  useContextProvider(RadioGroupContext, { toggle: !!toggle, groupId: id });
  const merged = mergeProps<'div'>(rest, {
    id,
    role: 'radiogroup',
    onKeyDown$: toggle ? [disableKeyDown, radioKeyDown] : [],
    onFocusIn$: focusInInputList,
    onFocusOut$: focusOutInputList,
  })
  return <div {...merged}>
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
    value: value?.toString(),
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

