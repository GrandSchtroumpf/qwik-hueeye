import { component$, Slot, $, useComputed$, useStyles$, sync$, useId } from "@builder.io/qwik";
import type { QRL, PropsOf, CorrectedToggleEvent } from "@builder.io/qwik";
import { usePopoverProvider } from "../../popover/popover";
import { useFormFieldId } from "../form-field/form-field";
import type { Serializable } from '../types';
import { mergeProps } from "../../utils/attributes";
import { useControl, useListControl } from "../control";
import { ListBox, flipListbox } from "../listbox/listbox";
import styles from './combobox.scss?inline';

export const filterCombobox = $((e: InputEvent, input: HTMLInputElement) => {
  const listboxId = input.getAttribute('aria-controls');
  if (!listboxId) throw new Error('Combobox should have aria-controls defined');
  const listbox = document.getElementById(listboxId);
  if (!listbox) throw new Error('Controlled element of Combobox is not in the DOM');
  const options = listbox.querySelectorAll<HTMLElement>('[role="option"]');
  const value = input.value.toLowerCase();
  flipListbox(listbox);
  for (const option of options) {
    const hasText = !value || option.textContent?.toLowerCase().includes(value);
    if (hasText) {
      option.removeAttribute('hidden');
    } else {
      option.removeAttribute('data-focus');
      option.setAttribute('hidden', 'hidden');
      if (input.getAttribute('aria-activedescendant') === option.id) {
        input.removeAttribute('aria-activedescendant');
      }
    }
  }
});

export const comboboxNavigation = $((e: KeyboardEvent, element: HTMLElement) => {
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    const setActive = (option?: HTMLElement) => {
      if (option) {
        element.setAttribute('aria-activedescendant', option.id);
        option.setAttribute('data-focus', '');
        option.scrollIntoView({ block: 'nearest' });
      } else {
        element.removeAttribute('aria-activedescendant');
      }
    }
    const controlId = element.getAttribute('aria-controls');
    if (!controlId) throw new Error('Combobox should have aria-controls defined');
    const control = document.getElementById(controlId);
    if (!control) throw new Error('Controlled element of Combobox is not in the DOM');
    const activeId = element.getAttribute('aria-activedescendant');
    const options = control.querySelectorAll<HTMLElement>('[role="option"]:not([hidden])');
    if (activeId) {
      document.getElementById(activeId)?.removeAttribute('data-focus');
      const index = Array.from(options).findIndex(option => option.id === activeId);
      if (e.key === 'ArrowDown') setActive(options.item(index + 1));
      if (e.key === 'ArrowUp') setActive(options.item(index - 1));
    } else {
      if (e.key === 'ArrowDown') setActive(options.item(0));
      if (e.key === 'ArrowUp') setActive(options.item(options.length - 1));
    }
  }
});

export const clearComboboxNavigation = (element: HTMLElement) => {
  element.removeAttribute('aria-activedescendant');
  const controlId = element.getAttribute('aria-controls');
  if (!controlId) return;
  const control = document.getElementById(controlId);
  if (!control) return;
  const options = control.querySelectorAll<HTMLElement>('[role="option"]');
  for (const option of options) {
    option.removeAttribute('data-focus');
    option.removeAttribute('hidden');
  }
}


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
  const inputId = useId();
  const listboxId = useId();

  const onKeyDown = $((e: KeyboardEvent) => {
    const popoverEl = document.getElementById(popover.id);
    const keys = ['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Enter', ' ', 'Home', 'End'];
    if (keys.includes(e.key)) popoverEl?.showPopover();
  });

  const onInputKeyDown = $((e: KeyboardEvent, input: HTMLElement) => {
    comboboxNavigation(e, input);
    if (e.key === 'Enter') {
      const activeId = input.getAttribute('aria-activedescendant');
      if (activeId) document.getElementById(activeId)?.click();
    }
  })
  
  const onToggle$ = $((e: CorrectedToggleEvent) => {
    const input = document.getElementById(inputId) as HTMLInputElement;
    if (!input) return;
    if (e.newState === 'open') {
      queueMicrotask(() => input?.focus());
    } else {
      clearComboboxNavigation(input);
      input.value = '';
    }
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
          id={inputId}
          type="text"
          class="he-combobox-input"
          role="combobox"
          autocomplete="off"
          autoCorrect="off"
          aria-controls={listboxId}
          onKeyDown$={onInputKeyDown}
          onInput$={filterCombobox}
        />
        <ListBox id={listboxId} multi={multi}>
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