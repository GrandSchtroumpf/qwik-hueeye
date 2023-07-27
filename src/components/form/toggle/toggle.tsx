import { $, component$,  Slot, useSignal, useStyles$, useContextProvider, useId, useContext, createContextId, QwikChangeEvent, QRL, Signal, useTask$, useVisibleTask$ } from "@builder.io/qwik";
import type { FieldsetAttributes } from "../types";
import { FieldContext } from "../field";
import { useFormValue } from "../form";
import { ArrowsKeys, nextFocus, previousFocus, useKeyboard, clsq  } from "../../utils";
import { toggleAll } from "../utils";
import styles from './toggle.scss?inline';


const disabledKeys = [...ArrowsKeys, 'Enter', ' ', 'ctrl+a'];

const ToggleGroupContext = createContextId<{ multi: boolean }>('ToggleGroupContext');

interface ToggleGroupProps extends Omit<FieldsetAttributes, 'onChange$'> {
  multi?: boolean;
  value?: string;
  'bind:value'?: Signal<string>;
  onChange$?: QRL<(value: string, event: QwikChangeEvent<HTMLInputElement>, fieldset: HTMLFieldSetElement) => any>
}

export const ToggleGroup = component$((props: ToggleGroupProps) => {
  useStyles$(styles);
  const root = useSignal<HTMLElement>();
  const active = useSignal('');
  const id = useId();
  const {
    name = id,
    multi = false,
    value,
    ["bind:value"]: bindValue,
    onChange$,
    ...attr
  } = props;
  if (onChange$ || bindValue) {
    attr.onChange$ = $((event: QwikChangeEvent<HTMLInputElement>, fieldset: HTMLFieldSetElement) => {
      if (onChange$) onChange$(event.target.value, event, fieldset);
      if (bindValue) bindValue.value = event.target.value;
    });
  }

  useVisibleTask$(() => {
    const initial = bindValue?.value ?? value;
    if (initial) {
      const input = root.value?.querySelector(`input[value="${initial}"]`) as HTMLInputElement;
      if (input) input.checked = true;
    }
  });

  useContextProvider(ToggleGroupContext, { multi });

  useKeyboard(root, disabledKeys, $((event, el) => {
    const key = event.key;
    if (key === 'ArrowDown' || key === 'ArrowRight') {
      nextFocus(el.querySelectorAll<HTMLElement>('input'));
    }
    if (key === 'ArrowUp' || key === 'ArrowLeft') {
      previousFocus(el.querySelectorAll<HTMLElement>('input'));
    }
    if (event.target instanceof HTMLInputElement) {
      const input = event.target;
      // Use click instead of setting checked to trigger onChange event
      if (key === 'Enter' || key === ' ') input.click();
    }
    if (multi && event.ctrlKey && key === 'a') toggleAll(el);
  }));

  useContextProvider(FieldContext, {
    name,
    change: $((event: any, input: HTMLInputElement) => {
      if (multi) return;
      active.value = input.checked ? input.id : '';
    }),
  });

  return <fieldset {...attr} ref={root} class={clsq('toggle-group', props.class)}>
    <Slot />
  </fieldset>

})

interface ToggleProps {
  value: string;
}

export const Toggle = component$((props: ToggleProps) => {
  const id = useId();
  const { name } = useContext(FieldContext);
  const { multi } = useContext(ToggleGroupContext);
  const type = multi ? 'checkbox' : 'radio';
  const initialValue = useFormValue<string | string[]>(name);
  const initialChecked = multi
    ? !!initialValue?.includes(props.value)
    : props.value === initialValue;
  const checked = useSignal(initialChecked);

  const toggle = $(() => checked.value = !checked.value);

  return  <div class="toggle">
    <input id={id} type={type} name={name} bind:checked={checked} value={props.value} onClick$={toggle}/>
    <label for={id}>
      <Slot/>
    </label>
  </div>
})