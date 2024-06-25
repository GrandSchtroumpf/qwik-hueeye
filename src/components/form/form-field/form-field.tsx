import { component$, Slot, createContextId, useContextProvider, useContext, useStyles$, PropsOf } from "@builder.io/qwik";
import { mergeProps } from "../../utils/attributes";
import { useWithId } from "../../hooks/useWithId";
import { Input, InputProps } from "../input/input";
import styles from './form-field.scss?inline';

interface FormFieldState {
  id: string;
}

export const FormFieldContext = createContextId<FormFieldState>('FormFieldContext');
export const useFormFieldId = (id?: string) => {
  const baseId = useWithId(id);
  const { id: finalId } = useContext(FormFieldContext, { id: baseId });
  return {
    id: finalId,
    hasFormField: id !== baseId,
  }
}

export const FormField = component$((props: PropsOf<'div'>) => {
  useStyles$(styles);
  const id = useWithId(props.id);
  useContextProvider(FormFieldContext, { id });
  const merged = mergeProps<'div'>(props, {
    id,
    class: 'he-form-field'
  });
  return <div {...merged}>
    <Slot />
  </div>
});

export const Label = component$<PropsOf<'label'>>((props) => {
  const { id } = useContext(FormFieldContext);
  return <label {...props} for={id} >
    <Slot/>
  </label>
})

export const InputField = component$<InputProps>((props) => {
  useStyles$(styles);
  return <div class="he-input-field">
    <Slot name="prefix"/>
    <Input {...props} class={[props.class, 'he-field']} />
    <Slot name="prefix"/>
  </div>
})