import { component$, Slot, useSignal, event$, $, useTask$, useComputed$, useStyles$, sync$, useId } from "@builder.io/qwik";
import type { QRL, PropsOf } from "@builder.io/qwik";
import { Popover, PopoverRoot, PopoverTrigger } from "../../dialog/popover";
import { useFormFieldId } from "../form-field/form-field";
import type { Serializable } from '../types';
import { mergeProps } from "../../utils/attributes";
import { useControl, useListControl } from "../control";
import { ListBox } from "../listbox/listbox";
import { isServer } from "@builder.io/qwik/build";
import styles from './select.scss?inline';

const isOption = (target: EventTarget | null) => {
  return target instanceof HTMLElement && target.getAttribute('role') === 'option';
}

const preventKeyDown = sync$((e: KeyboardEvent) => {
  const keys = ['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Enter', ' ', 'Home', 'End'];
  if (keys.includes(e.key)) return e.preventDefault();
  if (e.ctrlKey && e.key === 'a') return e.preventDefault();
});

export interface BaseSelectProps<T extends Serializable = Serializable> extends PropsOf<'div'> {
  multi: boolean;
  placeholder?: string;
  display$: QRL<(value?: T) => string>;
}
export const BaseSelect = component$(function<T extends Serializable>(props: BaseSelectProps<T>) {
  useStyles$(styles);
  const { id, hasFormField } = useFormFieldId(props.id);
  const { placeholder, display$, multi, ...divProps } = props;
  const anchorId = useId();
  const open = useSignal(false);
  
  useTask$(({ track }) => {
    track(() => open.value);
    if (isServer) return;
    const origin = document.getElementById(anchorId);
    if (!open.value || !origin) return;
    const base = '[role="option"]';
    const selected = `${base}[aria-checked="true"], ${base}[aria-selected="true"]`;
    const option = origin.querySelector(selected) ?? origin.querySelector(base);
    // Wait for dialog to open
    queueMicrotask(() => (option as HTMLElement)?.focus());
  });

  const onKeyDown = $((e: KeyboardEvent) => {
    if (!open.value) {
      const keys = ['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Enter', ' ', 'Home', 'End'];
      if (keys.includes(e.key)) open.value = true;
    } else {
      if (e.key === 'Tab') open.value = false;
      if (!multi && (e.key === 'Enter' || e.key === ' ')) open.value = false
    }
  });
  
  const onClick = event$(() => {
    if (open.value && !multi) open.value = false;
    if (!open.value) open.value = true;
  });

  const attributes = mergeProps<'div'>(divProps, {
    id: anchorId,
    class: 'he-select',
    onClick$: $((e, el) => {
      if (e.target === el) onClick();
      if (isOption(e.target) && !multi) open.value = false;
    }),
    onKeyDown$: [preventKeyDown, onKeyDown],
    "aria-label": hasFormField ? undefined : (divProps['aria-label'] || placeholder),
  });

  return (
    <PopoverRoot open={open}>
      <div {...attributes}>
        <Slot name="prefix"/>
        {multi
          ? <MultiTrigger id={id} display$={display$} placeholder={placeholder} />
          : <SingleTrigger id={id} display$={display$} placeholder={placeholder} />
        }
        <Slot name="suffix"/>
        <Popover anchor={anchorId} position="block">
          <ListBox multi={multi}>
            <Slot />
          </ListBox>
        </Popover>
      </div>
    </PopoverRoot>
  );
});


interface BaseTrigger<T extends Serializable = Serializable> extends PropsOf<'button'> {
  placeholder?: string;
  display$: QRL<(value?: T) => string>;
}
export const SingleTrigger = component$(function <T extends Serializable>(props: BaseTrigger<T>) {
  const { display$, placeholder, ...attr } = props;
  const { control } = useControl<T>();
  const text = useComputed$(() => display$(control.value));
  return <PopoverTrigger {...attr} aria-haspopup="listbox">
    {text.value ? <span>{text.value}</span> : <span class="placeholder">{placeholder}</span>}
  </PopoverTrigger>
});

export const MultiTrigger = component$(function <T extends Serializable>(props: BaseTrigger<T>) {
  const { display$, placeholder, ...attr } = props;
  const { list } = useListControl<T>();
  const text = useComputed$(() => display$(list.value as any));
  return <PopoverTrigger {...attr} aria-haspopup="listbox">
    {text.value ? <span>{text.value}</span> : <span class="placeholder">{placeholder}</span>}
  </PopoverTrigger>
})