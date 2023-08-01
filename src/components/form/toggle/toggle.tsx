import { $, component$,  Slot, useSignal, useStyles$, useContextProvider, useId, useContext, createContextId, useComputed$ } from "@builder.io/qwik";
import type { FieldsetAttributes } from "../types";
import { FieldContext } from "../field";
import { clsq  } from "../../utils";
import { ControlValueProps, extractControlProps, useControlValue, useControlProvider } from "../control";
import styles from './toggle.scss?inline';

const ToggleGroupContext = createContextId<{ multi: boolean }>('ToggleGroupContext');

interface ToggleGroupProps extends FieldsetAttributes, ControlValueProps<string | string[]> {
  multi?: boolean;
}

export const ToggleGroup = component$((props: ToggleGroupProps) => {
  useStyles$(styles);
  const active = useSignal('');
  const id = useId();
  const { multi = false, name = id } = props;
  const attr = extractControlProps(props);
  const { rootRef, onValueChange } = useControlProvider(multi ? 'list' : 'item', props);
  useContextProvider(ToggleGroupContext, { multi });

  useContextProvider(FieldContext, {
    name,
    change: $((event: any, input: HTMLInputElement) => {
      if (multi) return;
      active.value = input.checked ? input.id : '';
    }),
  });

  return <fieldset {...attr} ref={rootRef} onChange$={onValueChange} class={clsq('toggle-group', props.class)}>
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
  const value = props.value;
  const bindValue = useControlValue<string | string[]>();
  const type = multi ? 'checkbox' : 'radio';
  const checked = useComputed$(() => {
    if (multi) return bindValue.value.includes(value);
    else return bindValue.value === value
  });

  return  <div class="toggle">
    <input id={id} type={type} name={name} checked={checked.value} value={value}/>
    <label for={id}>
      <Slot/>
    </label>
  </div>
})