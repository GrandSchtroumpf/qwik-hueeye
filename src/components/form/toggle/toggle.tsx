import { component$,  Slot, useStyles$, useContextProvider, useId, useContext, createContextId, useComputed$, $ } from "@builder.io/qwik";
import type { DivAttributes, FieldsetAttributes } from "../types";
import { clsq, useKeyboard  } from "../../utils";
import { ControlValueProps, extractControlProps, useControlValue, useControlItemProvider, useControlListProvider } from "../control";
import styles from './toggle.scss?inline';
import { mergeProps } from "../../utils/attributes";

const ToggleGroupContext = createContextId<{ name: string, multi: boolean }>('ToggleGroupContext');

interface ToggleGroupProps extends FieldsetAttributes, ControlValueProps<string> {}

export const ToggleGroup = component$((props: ToggleGroupProps) => {
  useStyles$(styles);
  const id = useId();
  const attr = extractControlProps(props);
  const { rootRef, onValueChange } = useControlItemProvider(props);

  useKeyboard(rootRef, ['Enter', ' '], $((event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      if (event.target instanceof HTMLInputElement) event.target.click();
    }
  }))

  useContextProvider(ToggleGroupContext, {
    multi: false,
    name: props.name ?? id
  });

  return <fieldset {...attr} ref={rootRef} class={clsq('toggle-group', props.class)}>
    <Slot />
  </fieldset>
});

interface MultiToggleGroupProps extends FieldsetAttributes, ControlValueProps<string[]> {}
export const MultiToggleGroup = component$((props: MultiToggleGroupProps) => {
  useStyles$(styles);
  const id = useId();
  const attr = extractControlProps(props);
  const { rootRef, onValueChange } = useControlListProvider(props);
  useContextProvider(ToggleGroupContext, {
    multi: true,
    name: props.name ?? id
  });

  return <fieldset {...attr} ref={rootRef} onChange$={onValueChange} class={clsq('toggle-group', props.class)}>
    <Slot />
  </fieldset>
});



interface ToggleProps extends DivAttributes {
  value: string;
}
export const Toggle = component$(({ value, ...props}: ToggleProps) => {
  const id = useId();
  const { multi, name } = useContext(ToggleGroupContext);
  const {bindValue} = useControlValue<string | string[]>();
  const type = multi ? 'checkbox' : 'radio';
  const checked = useComputed$(() => {
    if (multi) return bindValue.value.includes(value);
    else return bindValue.value === value
  });
  const toggle = $(() => {
    if (multi) return bindValue.value = checked.value
      ? (bindValue.value as string[]).filter(v => v !== value)
      : (bindValue.value as string[]).concat(value);
    bindValue.value = checked.value ? '' : value;
  })

  const merged = mergeProps(props, { class: 'toggle '});

  return  <div {...merged}>
    {/* Prevent default click to manage toggle behavior */}
    <input id={id} type={type} name={name} checked={checked.value} value={value} onClick$={toggle} preventdefault:click/>
    <label for={id}>
      <Slot/>
    </label>
  </div>
})