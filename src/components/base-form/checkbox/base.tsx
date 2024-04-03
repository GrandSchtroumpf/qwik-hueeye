import { $, component$, Slot, PropsOf, createContextId, useContextProvider, useSignal, useContext, useTask$ } from "@builder.io/qwik";
import {  WithControl, WithControlGroup, WithControlList, extractControls, useControlProvider, useGroupControlProvider, useListControl, useListControlProvider } from "../control";
import type { InputAttributes, Serializable } from '../types';
import { mergeProps } from "../../utils/attributes";
import { useWithId } from "../../hooks/useWithId";

// LIST
const CheckListContext = createContextId<{ allValues?: any[] }>('CheckListContext');

type LocalCheckListProps = PropsOf<'div'> & {
  allValues?: Serializable[];
};
export type BaseCheckListProps = WithControlList<Serializable, PropsOf<'div'>>;
export const BaseCheckList = component$<WithControlList<Serializable, LocalCheckListProps>>((props) => {
  const { attr, controls } = extractControls(props);
  useListControlProvider(controls);
  useContextProvider(CheckListContext, { allValues: props.allValues });
  return <div {...attr} role="group">
    <Slot />
  </div>
});

interface BaseCheckAllProps extends InputAttributes {
  intermediateClass: string;
}
export const BaseCheckAll = component$<BaseCheckAllProps>((props) => {
  const { class: className, intermediateClass, ...attr } = props;
  const id = useWithId(props.id);
  const checkAllRef = useSignal<HTMLInputElement>();
  const classes = useSignal<string>('');
  const { allValues } = useContext(CheckListContext);
  const { list, clear, set } = useListControl();
  if (!allValues) throw new Error('List should have props "allValues" from the CheckList context.');
  // If there is an initialValue, verify the mode of the checkAll element
  useTask$(({ track }) => {
    const size = track(() => list.value.length);
    const allChecked = size === allValues.length;
    const isIndeterminate = !!size && !allChecked;
    classes.value = isIndeterminate ? intermediateClass : '';
    if (checkAllRef.value) {
      if (!size) {
        checkAllRef.value.indeterminate = false;
        checkAllRef.value.checked = false;
      } else {
        checkAllRef.value.indeterminate = isIndeterminate;
        checkAllRef.value.checked = !isIndeterminate;
      }
    }
  });
  const merged = mergeProps<'input'>(attr as any, {
    id,
    ref: checkAllRef,
    type: "checkbox",
    class: ["he-checkbox-input", classes.value],
    onClick$: $((e, el) => {
      if (el.checked) {
        set(allValues);
      } else {
        clear();
      }
    })
  });

  return <>
    <input {...merged}/>
    <label for={id} class={className}>
      <Slot/>
    </label>
  </>
});


export interface BaseCheckItemProps extends InputAttributes {
  value: Serializable;
}
export const BaseCheckItem = component$<BaseCheckItemProps>((props) => {
  const id = useWithId(props.id);
  const { value, class: className, ...attr } = props;
  const { list, add, remove, name } = useListControl();
  const merged = mergeProps<'input'>(attr as any, {
    id,
    type: "checkbox",
    class: "he-checkbox-input",
    name: name?.toString(),
    value: value?.toString(),
    checked: list.value.includes(value),
    onChange$: $((e, el) => el.checked ? add(value) : remove(value))
  });
  return <>
    <input {...merged} />
    <label for={id} class={className}>
      <Slot/>
    </label>
  </>
});

// GROUP
export type BaseCheckFieldsetProps = WithControlGroup<Record<string, boolean>, PropsOf<'fieldset'>>;
export const BaseCheckFieldset = component$<WithControlGroup<Record<string, boolean>, PropsOf<'fieldset'>>>((props) => {
  const { attr, controls } = extractControls(props);
  useGroupControlProvider(controls);
  return <fieldset {...attr}>
    <Slot />
  </fieldset>
});

export type BaseCheckGroupProps = WithControlGroup<Record<string, boolean>, PropsOf<'div'>>;
export const BaseCheckGroup = component$<WithControlGroup<Record<string, boolean>, PropsOf<'div'>>>((props) => {
  const { attr, controls } = extractControls(props);
  useGroupControlProvider(controls);
  return <div {...attr} role="group">
    <Slot />
  </div>
});

// CONTROL
export type BaseCheckboxProps = WithControl<boolean, InputAttributes>;
export const BaseCheckbox = component$<WithControl<boolean, InputAttributes>>((props) => {
  const id = useWithId(props.id);
  const { class: className, ...rest } = props;
  const { attr, controls } = extractControls(rest);
  const { control, onChange, name } = useControlProvider(controls);
  const merged = mergeProps<'input'>(attr as any, {
    id,
    type: "checkbox",
    class: "he-checkbox-input",
    name: name?.toString(),
    checked: !!control.value,
    onChange$: $((e, el) => onChange(el.checked)),
  });
  return <>
    <input {...merged} />
    <label for={id} class={className}>
      <Slot/>
    </label>
  </>
});
