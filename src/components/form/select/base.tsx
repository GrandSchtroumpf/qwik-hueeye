import { component$, Slot, useSignal, event$, $, useTask$, useComputed$, useStyles$, sync$ } from "@builder.io/qwik";
import type { QRL, PropsOf } from "@builder.io/qwik";
import { Popover, PopoverRoot, PopoverTrigger } from "../../dialog/popover";
import { useFormFieldId } from "../form-field/form-field";
import type { Serializable } from '../types';
import { mergeProps } from "../../utils/attributes";
import { focusInOptionList } from "../option/option";
import { focusList } from "../../list/utils";
import { useControl, useListControl } from "../control";
import { ListBox } from "../listbox/listbox";
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
  const origin = useSignal<HTMLElement>();
  const open = useSignal(false);
  
  useTask$(({ track }) => {
    track(() => open.value);
    if (!open.value || !origin.value) return;
    const base = '[role="option"]';
    const selected = `${base}[aria-checked="true"], ${base}[aria-selected="true"]`;
    const option = origin.value.querySelector(selected) ?? origin.value.querySelector(base);
    // Wait for dialog to open
    queueMicrotask(() => (option as HTMLElement)?.focus());
  });

  const onKeyDown = $((e: KeyboardEvent, el: HTMLElement) => {
    if (!open.value) {
      const keys = ['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Enter', ' ', 'Home', 'End'];
      if (keys.includes(e.key)) open.value = true;
    } else {
      if (e.key === 'Tab') {
        open.value = false;
        focusInOptionList(e, el);
      } else {
        focusList('[role="option"]', e, el);
      }
      if (!multi) {
        if (e.key === 'Enter' || e.key === ' ') open.value = false;
      } else {
        if (e.ctrlKey && e.key === 'a') toggleAll();
      }
    }
  });
  
  const onClick = event$(() => {
    if (open.value && !multi) open.value = false;
    if (!open.value) open.value = true;
  });

  const toggleAll = event$(() => {
    const options = origin.value?.querySelectorAll<HTMLInputElement>('[role="option"]');
    if (!options) return;
    options.forEach(option => option.click());
  });
  

  const attributes = mergeProps<'div'>(divProps, {
    class: 'he-select',
    onClick$: $((e, el) => {
      if (e.target === el) onClick();
      if (isOption(e.target) && !multi) open.value = false;
    }),
    onKeyDown$: [preventKeyDown, onKeyDown],
    onFocusIn$: focusInOptionList,
    "aria-label": hasFormField ? undefined : (divProps['aria-label'] || placeholder),
  });

  return (
    <PopoverRoot open={open}>
      <div ref={origin} {...attributes}>
        <Slot name="prefix"/>
        {multi
          ? <MultiTrigger id={id} display$={display$} placeholder={placeholder} />
          : <SingleTrigger id={id} display$={display$} placeholder={placeholder} />
        }
        <Slot name="suffix"/>
        <Popover origin={origin} position="block">
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
  return <PopoverTrigger {...attr}>
    {text.value ? <span>{text.value}</span> : <span class="placeholder">{placeholder}</span>}
  </PopoverTrigger>
});

export const MultiTrigger = component$(function <T extends Serializable>(props: BaseTrigger<T>) {
  const { display$, placeholder, ...attr } = props;
  const { list } = useListControl<T>();
  const text = useComputed$(() => display$(list.value as any));
  return <PopoverTrigger {...attr}>
    {text.value ? <span>{text.value}</span> : <span class="placeholder">{placeholder}</span>}
  </PopoverTrigger>
})