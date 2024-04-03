import { $, ButtonHTMLAttributes, Slot, component$ } from "@builder.io/qwik";
import { ControlListProps, useListControl, useListControlProvider } from "./control";
import type { Serializable } from './types';
import { mergeProps } from "../utils/attributes";

export const ListFieldset = component$((props: ControlListProps<Serializable>) => {
  useListControlProvider(props);
  return (
    <fieldset>
      <Slot />
    </fieldset>
  );
});

export const ListControl = component$((props: ControlListProps<Serializable>) => {
  useListControlProvider(props);
  return (
    <ul>
      <Slot />
    </ul>
  );
});

export const ListController = component$((props: ControlListProps<Serializable>) => {
  useListControlProvider(props);
  return <Slot />;
});


interface AddControlProps<T extends Serializable> extends ButtonHTMLAttributes<HTMLButtonElement> {
  item: T
}
export const AddControl = component$(function <T extends Serializable>(props: AddControlProps<T>) {
  const { add } = useListControl<T>();
  const { item, ...otherProps } = props;
  const attr = mergeProps<'button'>(otherProps, {
    onClick$: $(() => add(item)),
  });
  return <button type="button" {...attr}>
    <Slot />
  </button>
});
interface RemoveControlProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  index: number;
}
export const RemoveControl = component$(function(props: RemoveControlProps) {
  const { remove } = useListControl();
  const { index, ...otherProps } = props;
  const attr = mergeProps<'button'>(otherProps, {
    onClick$: $(() => remove(index)),
  });
  return <button type="button" {...attr}>
    <Slot />
  </button>
});