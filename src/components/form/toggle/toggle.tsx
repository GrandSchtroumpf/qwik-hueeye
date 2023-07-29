import { $, component$,  Slot, useSignal, useStyles$, useContextProvider, useId, useContext, createContextId, useComputed$ } from "@builder.io/qwik";
import type { FieldsetAttributes } from "../types";
import { FieldContext } from "../field";
import { ArrowsKeys, nextFocus, previousFocus, useKeyboard, clsq  } from "../../utils";
import { toggleAll } from "../utils";
import { ControlValueProps, extractControlProps, useControlValue, useControlValueProvider } from "../control";
import styles from './toggle.scss?inline';


const disabledKeys = [...ArrowsKeys, 'Enter', ' ', 'ctrl+a'];

const ToggleGroupContext = createContextId<{ multi: boolean }>('ToggleGroupContext');

interface ToggleGroupProps extends FieldsetAttributes, ControlValueProps<string | string[]> {
  multi?: boolean;
}


export const ToggleGroup = component$((props: ToggleGroupProps) => {
  useStyles$(styles);
  const root = useSignal<HTMLElement>();
  const active = useSignal('');
  const id = useId();
  const { multi = false, name = id } = props;
  const attr = extractControlProps(props);
  useControlValueProvider(props);
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
  const bindValue = useControlValue<string | string[]>();
  const type = multi ? 'checkbox' : 'radio';
  const checked = useComputed$(() => bindValue.value === props.value);

  const toggle = $(() => {
    if (multi) {
      bindValue.value = bindValue.value.includes(props.value)
        ? (bindValue.value as string[]).filter(v => v !== props.value)
        : bindValue.value.concat(props.value);
    } else {
      bindValue.value = bindValue.value === props.value ? '' : props.value;
    }
  });

  return  <div class="toggle">
    <input id={id} type={type} name={name} bind:checked={checked} value={props.value} onClick$={toggle}/>
    <label for={id}>
      <Slot/>
    </label>
  </div>
})