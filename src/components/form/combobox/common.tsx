import { $, CorrectedToggleEvent, PropsOf, Slot, component$, useId } from "@builder.io/qwik";
import { mergeProps } from "../../utils/attributes";
import { flipListbox } from "../listbox/listbox";
import { ListController } from "../controller-list";
import { Controller } from "../controller";

interface ControlProps {
  multi?: boolean;
  name: string;
}
export const Control = component$<ControlProps>((props) => {
  if (props.multi) {
    return <ListController name={props.name}>
      <Slot />
    </ListController>
  } else {
    return <Controller name={props.name}>
      <Slot />
    </Controller>
  }
});


interface InputProps extends PropsOf<'input'> {
  listboxId: string;
}

export const Input = component$<InputProps>((props) => {
  const { listboxId, ...rest } = props;
  const id = useId();

  const filter = $((e: InputEvent, input: HTMLInputElement) => {
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
  
  const keydown = $((e: KeyboardEvent, element: HTMLElement) => {
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


  const attributes = mergeProps<'input'>({ id }, rest, {
    class: 'he-combobox-input',
    onKeyDown$: keydown,
    onInput$: filter,
    role: 'combobox',
    autocomplete: 'off',
    'aria-controls': listboxId,
    'aria-autocomplete': 'list'
  });
  return <input {...attributes} />
});

interface TriggerProps extends PropsOf<'button'>{
  popoverId: string;
}
export const Trigger = component$<TriggerProps>((props) => {
  const { popoverId, ...rest } = props;
  const attributes = mergeProps<'button'>(rest, {
    class: 'he-combobox-trigger', 
    popovertarget: popoverId,
    'aria-controls': popoverId,
    'aria-expanded': false,
    'aria-haspopup': 'listbox'
  });
  return <button {...attributes}>
    <Slot />
  </button>
});

interface PopoverProps extends PropsOf<'div'> {
  id: string;
}
export const Popover = component$<PopoverProps>((props) => {

  const toggle = $((e: CorrectedToggleEvent, el: HTMLElement) => {
    const input = el.querySelector('.he-combobox-input') as HTMLInputElement;
    if (!input) return;
    if (e.newState === 'open') {
      queueMicrotask(() => input?.focus());
    } else {
      input.value = '';
      input.removeAttribute('aria-activedescendant');
      const controlId = input.getAttribute('aria-controls');
      if (!controlId) return;
      const control = document.getElementById(controlId);
      if (!control) return;
      const options = control.querySelectorAll<HTMLElement>('[role="option"]');
      for (const option of options) {
        option.removeAttribute('data-focus');
        option.removeAttribute('hidden');
      }
    }
  });

  const attributes = mergeProps<'div'>(props, {
    class: 'he-combobox-popover',
    popover: 'auto',
    onToggle$: toggle
  });
  return <div {...attributes}>
    <Slot />
  </div>;
});
