import { component$, Slot, useContextProvider, useId, useStyles$ } from "@builder.io/qwik";
import type { FieldProps} from '../field';
import { FieldGroupContext, useGroupName } from '../field';
import type { FieldsetAttributes, InputAttributes } from "../../types";
import { clsq } from '../../utils';
import styles from './radio.scss?inline';

export interface RadioGroupProps extends FieldProps, Omit<FieldsetAttributes, 'role' | 'tabIndex' | 'onKeyDown$'> {}


export const RadioGroup = component$((props: RadioGroupProps) => {
  useContextProvider(FieldGroupContext, { name: props.name });
  return <fieldset {...props} class={clsq("radio-group", props.class)} role="radiogroup">
    <Slot />
  </fieldset>
});


type RadioProps = Omit<InputAttributes, 'type' | 'children'>;
export const Radio = component$((props: RadioProps) => {
  useStyles$(styles);
  const id = useId();
  const nameId = useGroupName(props);
  
  return <div class="radio-item">
    <input id={id} type="radio" {...props} name={nameId} value={props.value} />
    <label for={id}>
      <svg focusable="false" viewBox="0 0 24 24" aria-hidden="true">
        <circle r="8" cx="12" cy="12"/>
      </svg>
      <Slot/>
    </label>
  </div>
});