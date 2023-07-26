import { component$, Slot, useStyles$, useSignal, event$, useId, useContextProvider, createContextId, useContext, $, useVisibleTask$, useTask$ } from "@builder.io/qwik";
import { Popover } from "../../dialog/popover";
import type { Signal , QRL } from "@builder.io/qwik";
import { useNameId } from "../field";
import type { FieldProps } from "../field";
import type { DisplayProps } from "../types";
import type { SelectionItemProps } from "../selection-list/types";
import { FormFieldContext } from "../form-field/form-field";
import { focusNextInput, focusPreviousInput, useKeyboard } from "../../utils";
import { toggleAll } from "../utils";
import { useFormValue } from "../form";
import styles from './select.scss?inline';


interface SelectProps<T = any> extends FieldProps<T>, DisplayProps<T> {
  multi?: boolean;
  placeholder?: string;
}

const SelectContext = createContextId<{
  opened: Signal<boolean>,
  multi: boolean,
  name: string,
  change: QRL<() => void>
}>('SelectContext');

const disabledKeys = ['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Enter', ' ', 'ctrl+a'];

export const Select = component$((props: SelectProps) => {
  useStyles$(styles);
  const { id } = useContext(FormFieldContext);
  const origin = useSignal<HTMLElement>();
  const opened = useSignal(false);
  const multi = props.multi ?? false;
  const display = useSignal('');
  const name = useNameId(props);
  const popoverId = useId();

  // Listeners
  const update = event$(() => {
    const value = [];
    const inputs = origin.value!.querySelectorAll<HTMLInputElement>(`input[name="${name}"]`);
    for (const input of inputs) {
      if (input.checked && input.value !== 'on') {
        const text = Array.from(input.labels ?? []).map(label => label.textContent).join(' ');
        value.push(text);
      }
    }
    display.value = value.join(', ');
  });
  
  const onClick$ = event$(() => {
    if (opened.value && !multi) opened.value = false;
    if (!opened.value) opened.value = true;
  });
  
  // Use useTask$ once this issue is fixed: https://github.com/BuilderIO/qwik/issues/4609
  const initialValue = useFormValue<string | string[]>(name);
  useVisibleTask$(() => {
    if (typeof initialValue === 'string' || initialValue?.length) update();
  });

  useTask$(({ track }) => {
    track(() => opened.value);
    if (!opened.value) return;
    const active = origin.value?.querySelector<HTMLElement>('input:checked');
    // Wait for dialog to open
    if (active) requestAnimationFrame(() => active.focus()) ;
  })

  useKeyboard(origin, disabledKeys, $((event, el) => {
    const key = event.key;
    if (!opened.value) {
      if (disabledKeys.includes(key)) opened.value = true;
    } else {
      if (key === 'ArrowLeft' || key === 'ArrowUp') focusPreviousInput(el);
      if (key === 'ArrowRight' || key === 'ArrowDown') focusNextInput(el);
      if (key === 'Tab') opened.value = false;
      if (!multi) {
        if (['Enter', ' '].includes(key)) opened.value = false;
      } else {
        if (event.ctrlKey && key === 'a') toggleAll(el);
      }
    }
  }));

  useVisibleTask$(() => {
    const form = origin.value!.querySelector<HTMLInputElement>(`input[name="${name}"]`)?.form;
    const handler = () => requestAnimationFrame(update);
    form?.addEventListener('reset', handler);
    return () => form?.removeEventListener('reset', handler);
  });
  
  useContextProvider(SelectContext, {
    name,
    multi,
    opened,
    change: $(() => update()),
  });


  return <>
    <div class="field select" ref={origin}
      onClick$={(e, el) => e.target === el ? onClick$() : null}
      onBlur$={() => opened.value = false}
      >
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
        <span class={display.value ? 'value' : 'placeholder'}>
          {display.value || props.placeholder}
        </span>
        <svg viewBox="7 10 10 5" class={opened.value ? 'opened' : 'closed'} aria-hidden="true" focusable="false">
          <polygon stroke="none" fill-rule="evenodd" points="7 10 12 15 17 10"></polygon>
        </svg>
      </button>
      <Slot name="suffix"/>
      <Popover origin={origin} open={opened} position="block" id={popoverId}>
        <div class="listbox" role="listbox" aria-labelledby={'label-' + id} aria-multiselectable={multi}>
          <Slot />
        </div>
      </Popover>
    </div>
  </>
});


export const Option = component$((props: SelectionItemProps) => {
  const { multi, opened, name, change } = useContext(SelectContext);
  const id = useId();
  const ref = useSignal<HTMLInputElement>();
  const initialValue = useFormValue<string | string[]>(name);
  
  useKeyboard(ref, ['Enter', ' '], $((event, input) => {
    if (event.key === 'Enter' || event.key === ' ') input.click();
  }));
  
  if (multi) {
    const initialChecked = !!initialValue?.includes(props.value ?? '');
    return <div class="option">
      <input id={id} ref={ref} role="option" type="checkbox" name={name} value={props.value} checked={initialChecked} onChange$={change}/>
      <label for={id}>
        <Slot/>
      </label>
    </div>
  } else {
    const initialChecked = props.value === initialValue;
    return <div class="option">
      <input id={id} ref={ref} role="option" type="radio" name={name} value={props.value} checked={initialChecked} onChange$={change} />
      <label for={id} onClick$={() =>  opened.value = false}>
        <Slot/>
      </label>
    </div>
  }
  
});