import { component$, useId, Slot, createContextId, useContextProvider, useContext, useStyles$ } from "@builder.io/qwik";
import type { DivAttributes } from "../types";
import { clsq } from "../../utils";
import styles from './form-field.scss?inline';

interface FormFieldState {
  id: string;
}

export const FormFieldContext = createContextId<FormFieldState>('FormFieldContext');

export const FormField = component$((props: DivAttributes) => {
  useStyles$(styles);
  const id = useId();
  useContextProvider(FormFieldContext, { id })
  return <div {...props} class={clsq('form-field', props.class)}>
    <Slot/>
  </div>
});

export const Label = component$(() => {
  const { id } = useContext(FormFieldContext);
  return <label for={id} id={'label-' + id}>
    <Slot/>
  </label>
})