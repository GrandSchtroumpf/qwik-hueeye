import { $, component$, Slot, PropsOf, createContextId, useContextProvider, useSignal, useContext, useTask$, Signal, QRL, sync$ } from "@builder.io/qwik";
import {  WithControl, WithControlGroup, WithControlList, extractControls, useControlProvider, useGroupControlProvider, useListControl, useListControlProvider } from "../control";
import type { InputAttributes, Serializable } from '../types';
import { mergeProps } from "../../utils/attributes";
import { useWithId } from "../../hooks/useWithId";
import { focusInInputList, focusOutInputList } from "../utils";
import { focusList, focusNext, focusPrevious } from '../../list/utils';

const preventKeyDown = sync$((e: KeyboardEvent) => {
  const keys = ['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Enter', 'Home', 'End', ' '];
  if (keys.includes(e.key)) return e.preventDefault();
  if (e.ctrlKey && e.key === 'a') return e.preventDefault();
});


// LIST
const CheckListContext = createContextId<{ allValues?: any[], toggleAll: QRL<() => void> }>('CheckListContext');

type LocalCheckListProps = PropsOf<'div'> & {
  allValues?: Serializable[];
};
export type BaseCheckListProps = WithControlList<Serializable, PropsOf<'div'>>;
export const BaseCheckList = component$<WithControlList<Serializable, LocalCheckListProps>>((props) => {
  const baseRef = useSignal<HTMLDivElement>();
  const ref = (props.ref as Signal<HTMLElement>) ?? baseRef;
  const { attr, controls } = extractControls(props);
  const { set, clear } = useListControlProvider(controls);
  const allValues = props.allValues;


  const toggleAll = $(() => {
    const allChecked = !ref.value.querySelector('input[type="checkbox"]:not(:checked)');
    if (allValues) {
      allChecked ? clear() : set(allValues);
    }
  })

  useContextProvider(CheckListContext, { allValues, toggleAll });

  const onKeyDown = $(async (e: KeyboardEvent, el: HTMLElement) => {
    if (e.ctrlKey) {
      if (e.key === 'a') toggleAll();
    } else if (e.shiftKey) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        const next = await focusNext('input', el);
        next?.click();
      }
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        const previous = await focusPrevious('input', el);
        previous?.click();
      }
    } else {
      focusList('input', e, el);
    }
  });


  const merged = mergeProps<'div'>(attr, {
    role: 'group',
    ref: ref,
    onFocusIn$: focusInInputList,
    onFocusOut$: focusOutInputList,
    onKeyDown$: [preventKeyDown, onKeyDown],
  });

  return <div {...merged}>
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
  const onKeyDown = $((e: KeyboardEvent, el: HTMLElement) => focusList('input', e, el));
  const merged = mergeProps<'div'>(attr, {
    role: 'group',
    onKeyDown$: [preventKeyDown, onKeyDown],
    onFocusIn$: focusInInputList,
    onFocusOut$: focusOutInputList,
  })
  return <div {...merged}>
    <Slot />
  </div>
});

// CONTROL
export type BaseCheckboxProps = WithControl<boolean, InputAttributes>;
export const BaseCheckbox = component$<WithControl<boolean, InputAttributes>>((props) => {
  const id = useWithId(props.id);
  const { class: className, ...rest } = props;
  const { attr, controls } = extractControls(rest);
  const { control, change, name } = useControlProvider(controls);
  const merged = mergeProps<'input'>(attr as any, {
    id,
    type: "checkbox",
    class: "he-checkbox-input",
    name: name?.toString(),
    checked: !!control.value,
    onChange$: $((e, el) => change(el.checked)),
  });
  return <>
    <input {...merged} />
    <label for={id} class={className}>
      <Slot/>
    </label>
  </>
});
