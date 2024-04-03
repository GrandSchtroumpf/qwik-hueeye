import { component$, Slot, useSignal, event$, useId, $, useTask$, useComputed$, useStyles$ } from "@builder.io/qwik";
import type { QRL, Signal, PropsOf } from "@builder.io/qwik";
import { Popover } from "../../dialog/popover";
import { useFormFieldId } from "../form-field/form-field";
import { focusNextOption, focusPreviousOption, useKeyboard } from "../../utils";
import type { Serializable } from '../types';
import { mergeProps } from "../../utils/attributes";
import styles from './select.scss?inline';

const isOption = (target: EventTarget | null) => {
  return target instanceof HTMLElement && target.getAttribute('role') === 'option';
}

const disabledKeys = ['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Enter', ' ', 'ctrl+a'];
export interface BaseSelectImplProps<T extends Serializable> {
  placeholder?: string;
  display$: QRL<(value: T) => string>;
}
type BaseSelectProps<T extends Serializable> =  BaseSelectImplProps<T> & PropsOf<'div'> & {
  placeholder?: string;
  multi: boolean;
  currentValue: Signal<T>;
  display$: QRL<(value: T) => string>;
}
export const BaseSelect = component$(function<T extends Serializable>(props: BaseSelectProps<T>) {
  useStyles$(styles);
  const { id, hasFormField } = useFormFieldId(props.id);
  const { placeholder, display$, currentValue, multi, ...divProps } = props;
  const origin = useSignal<HTMLElement>();
  const opened = useSignal(false);
  const popoverId = useId();

  // Customer display function
  const displayText = useComputed$(() => display$(currentValue.value));
  
  useTask$(({ track }) => {
    track(() => opened.value);
    if (!opened.value) return;
    const active = origin.value?.querySelector<HTMLElement>('[aria-checked="true"]');
    // Wait for dialog to open
    if (active) requestAnimationFrame(() => active.focus()) ;
  });

  useKeyboard(origin, disabledKeys, $((event, el) => {
    const key = event.key;
    if (!opened.value) {
      if (disabledKeys.includes(key)) opened.value = true;
    } else {
      // TODO: move this in a Listbox component
      if (key === 'ArrowLeft' || key === 'ArrowUp') focusPreviousOption(el);
      if (key === 'ArrowRight' || key === 'ArrowDown') focusNextOption(el);
      if (key === 'Tab') opened.value = false;
      if (key === 'Enter' || key === ' ') {
        if (event.target instanceof HTMLElement) event.target.click();
        if (!multi) opened.value = false;
      }
      if (event.ctrlKey && key === 'a' && multi) toggleAll();
    }
  }));
  
  const onClick$ = event$(() => {
    if (opened.value && !multi) opened.value = false;
    if (!opened.value) opened.value = true;
  });

  const toggleAll = event$(() => {
    const options = origin.value?.querySelectorAll<HTMLInputElement>('[role="option"]');
    if (!options) return;
    options.forEach(option => option.click());
  });
  

  const attributes = mergeProps<'div'>(divProps, {
    class: 'he-select',
    onBlur$: $(() => opened.value = false),
    onClick$: $((e, el) => {
      if (e.target === el) onClick$();
      if (isOption(e.target) && !multi) opened.value = false;
    }),
    "aria-label": hasFormField ? undefined : (divProps['aria-label'] || placeholder),
  })

  return <>
    <div ref={origin} {...attributes}>
      <Slot name="prefix"/>
      <button type="button" id={id}
        role="combobox"
        aria-haspopup="listbox" 
        aria-disabled="false"
        aria-invalid="false"
        aria-autocomplete="none"
        aria-expanded={opened.value}
        aria-controls={popoverId}
        aria-labelledby={'label-' + id}
        onClick$={onClick$}
      >
        {displayText.value ? (
          <span>{displayText.value.toString()}</span>
        ) : (
          <span class="placeholder">{placeholder}</span>
        )}
        <svg viewBox="7 10 10 5" class={opened.value ? 'opened' : 'closed'} aria-hidden="true" focusable="false">
          <polygon stroke="none" fill-rule="evenodd" points="7 10 12 15 17 10"></polygon>
        </svg>
      </button>
      <Slot name="suffix"/>
      <Popover origin={origin} open={opened} position="block" id={popoverId}>
        <ul class="listbox" role="listbox" aria-labelledby={'label-' + id} aria-multiselectable={multi}>
          <Slot />
        </ul>
      </Popover>
    </div>
  </>
});
