import type { QwikJSX} from "@builder.io/qwik";
import { useSignal } from "@builder.io/qwik";
import { component$, Slot, useContext, useStyles$ } from "@builder.io/qwik";
import type { FieldProps} from "../field";
import { useFormValue } from "../form";
import { FormFieldContext } from "../form-field/form-field";
import styles from './input.scss?inline';

type InputAttributes = Omit<QwikJSX.IntrinsicElements['input'], 'children' | 'value'>;
interface InputProps extends InputAttributes, FieldProps {
  appearance?: 'standard' | 'stack';
}

export const Input = component$((props: InputProps) => {
  useStyles$(styles);
  const field = useContext(FormFieldContext, null);
  const ref = useSignal<HTMLInputElement>();
  const initialValue = useFormValue(props.name);
  const value = props.value ?? initialValue;

  return <div class="field">
    <Slot name="prefix"/>
    <input {...props} id={field?.id} ref={ref} value={value}/>
    <Slot name="suffix"/>
  </div>
})