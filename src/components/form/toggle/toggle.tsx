import { $, component$,  Slot, useSignal, useStyles$, useContextProvider, useId, useContext, createContextId } from "@builder.io/qwik";
import type { FieldProps } from "../field";
import { FieldContext } from "../field";
import type { FieldsetAttributes } from "../types";
import { ArrowsKeys, nextFocus, previousFocus, useKeyboard, clsq } from "../../utils";
import { toggleAll } from "../utils";
import styles from './toggle.scss?inline';

export interface CheckgroupProps extends FieldProps, Omit<FieldsetAttributes, 'role' | 'tabIndex' | 'onKeyDown$'> {}

const disabledKeys = [...ArrowsKeys, 'Enter', ' ', 'ctrl+a'];

const ToggleGroupContext = createContextId<{ multi: boolean }>('ToggleGroupContext');

interface ToggleGroupProps extends FieldsetAttributes {
  multi?: boolean;
}

export const ToggleGroup = component$((props: ToggleGroupProps) => {
  useStyles$(styles);
  const root = useSignal<HTMLElement>();
  const active = useSignal('');
  const id = useId();
  const nameId = props.name ?? id;
  const multi = props.multi ?? false;

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
    name: nameId,
    change: $((event: any, input: HTMLInputElement) => {
      if (multi) return;
      active.value = input.checked ? input.id : '';
    }),
  });

  return <fieldset {...props} ref={root} class={clsq('toggle-group', props.class)}>
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
  const checked = useSignal(false);

  const toggle = $(() => checked.value = !checked.value);

  return  <div class="toggle">
    <input id={id} type={type} name={name} bind:checked={checked} value={props.value} onClick$={toggle}/>
    <label for={id}>
      <Slot/>
    </label>
  </div>
})