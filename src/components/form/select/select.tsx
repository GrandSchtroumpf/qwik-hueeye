import { component$, Slot, useStyles$, useSignal, event$, useId, useContextProvider, createContextId, useContext, $, useVisibleTask$, useTask$, useComputed$ } from "@builder.io/qwik";
import { Popover } from "../../dialog/popover";
import type { Signal } from "@builder.io/qwik";
import { useNameId } from "../field";
import type { DisplayProps } from "../types";
import type { SelectionItemProps } from "../selection-list/types";
import { FormFieldContext } from "../form-field/form-field";
import { focusNextInput, focusPreviousInput, useKeyboard, useOnReset } from "../../utils";
import { ControlValueProps, useControlValue, useControlValueProvider } from "../control";
import styles from './select.scss?inline';


interface SelectProps<T = any> extends ControlValueProps<T>, DisplayProps<T> {
  multi?: boolean;
  placeholder?: string;
}

const SelectContext = createContextId<{
  opened: Signal<boolean>,
  multi: boolean,
  name: string,
}>('SelectContext');

const disabledKeys = ['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Enter', ' ', 'ctrl+a'];


export const MultiSelect = component$((props: Omit<SelectProps<string[]>, 'multi'>) => {
  return <BaseSelect multi {...props}>
    <Slot/>
  </BaseSelect>;
})

export const Select = component$((props: Omit<SelectProps<string>, 'multi'>) => {
  return <BaseSelect {...props}>
    <Slot/>
  </BaseSelect>;
})

export const BaseSelect = component$((props: SelectProps) => {
  useStyles$(styles);
  const { id } = useContext(FormFieldContext);
  const origin = useSignal<HTMLElement>();
  const opened = useSignal(false);
  const multi = props.multi ?? false;
  const displayDefault = useSignal('');
  const name = useNameId(props);
  const popoverId = useId();
  
  const onClick$ = event$(() => {
    if (opened.value && !multi) opened.value = false;
    if (!opened.value) opened.value = true;
  });

  const { bindValue, initialValue } = useControlValueProvider<string | string[]>(props, multi ? [] : '');
  useOnReset(origin, $(() => bindValue.value = initialValue));
  
  // Customer display function
  const displayText = useComputed$(() => props.display$?.(bindValue.value));
  const display = useComputed$(() => displayText.value ?? displayDefault.value);
  const displayClass = useComputed$(() => display.value ? 'value' : 'placeholder');

  // Default display only works on the browser
  useVisibleTask$(({ track }) => {
    track(() => bindValue.value);
    if (props.display$) return;
    const value = [];
    const inputs = origin.value!.querySelectorAll<HTMLInputElement>(`input:checked[name="${name}"]`);
    for (const input of inputs) {
      if (input.checked && input.value && input.value !== 'on') {
        const text = Array.from(input.labels ?? []).map(label => label.textContent).join(' ');
        value.push(text);
      }
    }
    displayDefault.value = value.join(', ');
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
      if (key === 'Enter' || key === ' ') {
        if (event.target instanceof HTMLInputElement) event.target.click();
        if (!multi) opened.value = false;
      }
      if (event.ctrlKey && key === 'a' && multi) {
        const checkboxes = origin.value?.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
        if (!checkboxes) return;
        if (bindValue.value?.length === checkboxes.length) return bindValue.value = [];
        bindValue.value = Array.from(checkboxes).filter(c => !!c.value).map(c => c.value);
      }
    }
  }));


  useContextProvider(SelectContext, {
    name,
    multi,
    opened,
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
        <span class={displayClass.value}>
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


const SingleOption = component$((props: SelectionItemProps) => {
  const value = props.value ?? '';
  const { opened, name } = useContext(SelectContext);
  const id = useId();
  const bindValue = useControlValue<string>();
  const checked = useComputed$(() => !!value && bindValue.value === value);
  const toggle = $(() => {
    opened.value = false;
    bindValue.value = checked.value ? '' : value;
  });
  return  <div class="option">
    <input id={id} type="radio" name={name} checked={checked.value} value={value} onClick$={toggle}/>
    <label for={id}>
      <Slot/>
    </label>
  </div>
});

const MultiOption = component$((props: SelectionItemProps) => {
  const value = props.value ?? '';
  const id = useId();
  const { name } = useContext(SelectContext);
  const bindValue = useControlValue<string[]>();
  const checked = useComputed$(() => !!value && bindValue.value.includes(value));
  const toggle = $(() => {
    bindValue.value = checked.value
      ? bindValue.value.filter(v => v !== value)
      : bindValue.value.concat(value);
  });
  return <div class="option">
    <input id={id} type="checkbox" name={name} checked={checked.value} value={value} onClick$={toggle}/>
    <label for={id}>
      <Slot/>
    </label>
  </div>
})

export const Option = component$((props: SelectionItemProps) => {
  const { multi } = useContext(SelectContext);
  if (multi) {
    return <MultiOption {...props}>
      <Slot/>
    </MultiOption>
  } else {
    return <SingleOption {...props}>
      <Slot/>
    </SingleOption>
  }  
});