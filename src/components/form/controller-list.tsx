import { $, PropsOf, Slot, component$ } from "@builder.io/qwik";
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

export const ListController = component$(function <T extends Serializable>(props: ControlListProps<T>) {
  useListControlProvider(props);
  return <Slot />;
});


interface AddControlProps<T extends Serializable> extends PropsOf<'button'> {
  item: T
}
export const AddControl = component$(function <T extends Serializable>(props: AddControlProps<T>) {
  const { add } = useListControl<T>();
  const { item, ...otherProps } = props;
  const attr = mergeProps<'button'>(otherProps, {
    onClick$: $(() => add(structuredClone(item))),
  });
  return <button type="button" {...attr}>
    <Slot />
  </button>
});
interface RemoveControlProps extends PropsOf<'button'> {
  index: number;
}
export const RemoveControl = component$(function(props: RemoveControlProps) {
  const { removeAt } = useListControl();
  const { index, ...otherProps } = props;
  const attr = mergeProps<'button'>(otherProps, {
    onClick$: $(() => removeAt(index)),
  });
  return <button type="button" {...attr}>
    <Slot />
  </button>
});