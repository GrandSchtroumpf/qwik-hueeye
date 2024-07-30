import { component$, Slot, $, useComputed$, useStyles$, sync$ } from "@builder.io/qwik";
import type { QRL, PropsOf, CorrectedToggleEvent } from "@builder.io/qwik";
import { usePopoverProvider } from "../../popover/popover";
import { useFormFieldId } from "../form-field/form-field";
import type { Serializable } from '../types';
import { mergeProps } from "../../utils/attributes";
import { useControl, useListControl } from "../control";
import { ListBox } from "../listbox/listbox";
import styles from './combobox.scss?inline';


const preventKeyDown = sync$((e: KeyboardEvent) => {
  const keys = ['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Enter', ' ', 'Home', 'End'];
  if (keys.includes(e.key)) return e.preventDefault();
  if (e.ctrlKey && e.key === 'a') return e.preventDefault();
});

export interface BaseComboboxProps<T extends Serializable = Serializable> extends PropsOf<'button'> {
  multi: boolean;
  placeholder?: string;
  display$: QRL<(value?: T) => string>;
}
export const BaseCombobox = component$(function<T extends Serializable>(props: BaseComboboxProps<T>) {
  useStyles$(styles);
  const { id: anchorId } = useFormFieldId(props.id);
  const { placeholder, display$, multi, ...buttonProps } = props;
  const { open, popover, trigger } = usePopoverProvider({ anchorId });

  const onKeyDown = $((e: KeyboardEvent) => {
    const popoverEl = document.getElementById(popover.id);
    const keys = ['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Enter', ' ', 'Home', 'End'];
    if (keys.includes(e.key)) popoverEl?.showPopover();
  });
  
  const onToggle$ = $((e: CorrectedToggleEvent) => {
    if (e.newState !== 'open') return;
    const input = document.getElementById(anchorId)?.querySelector('input');
    // Wait for dialog to open
    queueMicrotask(() => input?.focus());
  });

  const triggerProps = mergeProps<'button'>(trigger, buttonProps, {
    type: 'button',
    class: 'he-combobox',
    onKeyDown$: [preventKeyDown, onKeyDown],
    "aria-label": placeholder,
  });

  const popoverProps = mergeProps<'div'>(popover, {
    class: 'he-combobox-popover',
    onToggle$,
    onKeyDown$: $((e, el) => {
      if (e.key === 'Tab') el?.hidePopover();
    }),
  });

  return (
    <>
      <button {...triggerProps}>
        <Slot name="prefix"/>
        {multi
          ? <MultiTrigger display$={display$} placeholder={placeholder} />
          : <SingleTrigger display$={display$} placeholder={placeholder} />
        }
        <Slot name="suffix"/>
        <svg viewBox="7 10 10 5" height="4px" class={open.value ? 'opened' : ''} aria-hidden="true" focusable="false">
          <polygon stroke="none" fill="currentColor" points="7 10 12 15 17 10"></polygon>
        </svg>
      </button>
      <div {...popoverProps}>
        <input
          type="text"
          class="he-combobox-input"
          role="combobox"
          autocomplete="off"
          autoCorrect="off"
        />
        <ListBox multi={multi}>
          <Slot />
        </ListBox>
      </div>
    </>
  );
});


interface BaseTrigger<T extends Serializable = Serializable> {
  placeholder?: string;
  display$: QRL<(value?: T) => string>;
}
export const SingleTrigger = component$(function <T extends Serializable>(props: BaseTrigger<T>) {
  const { display$, placeholder } = props;
  const { control } = useControl<T>();
  const text = useComputed$(() => display$(control.value));
  return text.value ? <span>{text.value}</span> : <span class="placeholder">{placeholder}</span>
});

export const MultiTrigger = component$(function <T extends Serializable>(props: BaseTrigger<T>) {
  const { display$, placeholder } = props;
  const { list } = useListControl<T>();
  const text = useComputed$(() => display$(list.value as any));
  return text.value ? <span>{text.value}</span> : <span class="placeholder">{placeholder}</span>;
})