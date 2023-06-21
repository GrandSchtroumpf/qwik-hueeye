import type { QwikJSX} from "@builder.io/qwik";
import { useSignal } from "@builder.io/qwik";
import { component$, Slot, useContext, useStyles$ } from "@builder.io/qwik";
import type { FieldProps} from "../field";
import { useFormController } from "../form";
import { FormFieldContext } from "../form-field/form-field";
import styles from './input.scss?inline';

type InputAttributes = Omit<QwikJSX.IntrinsicElements['input'], 'children' | 'value'>;
interface InputProps extends InputAttributes, FieldProps {
  appearance?: 'standard' | 'stack';
}

export const Input = component$((props: InputProps) => {
  useStyles$(styles);
  const { id } = useContext(FormFieldContext);
  const ref = useSignal<HTMLInputElement>();
  useFormController(ref);

  return <div class="field">
    <Slot name="prefix"/>
    <input {...props} id={id} ref={ref}/>
    <Slot name="suffix"/>
  </div>
})