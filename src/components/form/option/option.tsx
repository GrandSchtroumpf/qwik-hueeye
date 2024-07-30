import { $, PropsOf, Slot, component$, useComputed$, useStyles$ } from "@builder.io/qwik";
import { Serializable } from "../types";
import { ControlItemProps, useControl, useListControl } from "../control";
import { mergeProps } from "../../utils/attributes";
import styles from './option.scss?inline';
import { useListBoxContext } from "../listbox/listbox";

export const focusInOptionList = $((e: Event, el: HTMLElement) => {
  const active = document.activeElement;
  const options = el.querySelectorAll('[role="option"]');
  for (let i = 0; i < options.length; i++) {
    if (active !== options[i]) options[i].setAttribute('tabindex', '-1');
  }
});
export const focusOutOptionList = $((e: Event, el: HTMLElement) => {
  const base = '[role="option"]';
  const selected = `${base}[aria-selected="true"], ${base}[aria-checked="true"]`
  const option = el.querySelector(selected) ?? el.querySelector(base);
  option?.setAttribute('tabindex', '0');
});

export const Option = component$<BaseOptionProps>((props) => {
  const { multi } = useListBoxContext();
  if (multi) {
    return <MultiOption {...props}>
      <Slot />
    </MultiOption>
  } else {
    return <SingleOption  {...props}>
      <Slot />
    </SingleOption>
  }
});


type BaseOptionProps<T extends Serializable = Serializable> = ControlItemProps<T> & PropsOf<'li'>;


const MultiOption = component$<BaseOptionProps>((props) => {
  useStyles$(styles);
  const { list, add, removeAt } = useListControl();
  const { value, ...otherProps } = props;
  const checked = useComputed$(() => list.value.includes(value));

  const attr = mergeProps<'li'>(otherProps, {
    class: 'he-option',
    onClick$: $(() => {
      return checked.value
        ? removeAt(list.value.indexOf(value))
        : add(value)
    }),
  })

  return <li
    {...attr}
    role="option"
    aria-checked={checked.value}
    aria-valuetext={value?.toString()}
    tabIndex={0}
  >
    <Slot />
  </li>
})

const SingleOption = component$<BaseOptionProps>((props) => {
  useStyles$(styles);
  const { value, ...otherProps } = props;
  const { control, onChange } = useControl();

  const attr = mergeProps<'li'>(otherProps, {
    class: 'he-option',
    onClick$: $(() => {
      return control.value === value
        ? onChange(undefined)
        : onChange(value);
    }),
  });

  return <li
    {...attr}
    role="option"
    aria-selected={!!value && control.value === value}
    aria-valuetext={value?.toString()}
    tabIndex={0}
  >
    <Slot />
  </li>
})



interface OptionGroupProps {
  label: string;
  disabled?: boolean;
}
export const OptionGroup = component$(({ label }: OptionGroupProps) => {
  useStyles$(styles);
  return <li>
    <ul role="group">
      <h4>{label}</h4>
      <Slot/>
    </ul>
  </li>
})
