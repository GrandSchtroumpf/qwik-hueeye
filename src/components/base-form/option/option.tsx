import { $, FunctionComponent, JSXChildren, PropsOf, Slot, component$, useComputed$, useStyles$ } from "@builder.io/qwik";
import { Serializable } from "../types";
import { ControlItemProps, useControl, useListControl } from "../control";
import { mergeProps } from "../../utils/attributes";
import styles from './option.scss?inline';



interface OptionProps<T extends Serializable = Serializable> extends BaseOptionProps<T> {
  multi?: boolean;
  children: JSXChildren;
}
export const Option: FunctionComponent<OptionProps> = ({ multi, children, ...props }) => {
  if (multi) {
    return <MultiOptionImpl {...props}>
      {children}
    </MultiOptionImpl>
  } else {
    return <OptionImpl  {...props}>
      {children}
    </OptionImpl>
  }
}


type BaseOptionProps<T extends Serializable = Serializable> = ControlItemProps<T> & PropsOf<'li'>;


const MultiOptionImpl = component$<BaseOptionProps>((props) => {
  useStyles$(styles);
  const { list, add, removeAt } = useListControl();
  const { value, ...otherProps } = props;

  const checked = useComputed$(() => list.value.includes(value));

  const attr = mergeProps<'li'>(otherProps, {
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

const OptionImpl = component$<BaseOptionProps>((props) => {
  useStyles$(styles);
  const { value, ...otherProps } = props;
  const { control, onChange } = useControl();

  const attr = mergeProps<'li'>(otherProps, {
    onClick$: $(() => {
      console.log({ control: control.value, value });
      return control.value === value
        ? onChange(undefined)
        : onChange(value);
    }),
  });

  return <li
    {...attr}
    role="option"
    aria-selected={control.value === value}
    aria-valuetext={value?.toString()}
  >
    <Slot />
  </li>
})