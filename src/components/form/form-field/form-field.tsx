import { component$, Slot, createContextId, useContextProvider, useContext, useStyles$, PropsOf } from "@builder.io/qwik";
import { mergeProps } from "../../utils/attributes";
import { useWithId } from "../../hooks/useWithId";
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
  // TODO: remove after useContext is fixed in v2.0
  useContext(FormFieldContext);
  const merged = mergeProps<'div'>(props, {
    class: 'he-form-field'
  });
  return <div {...merged}>
    <Slot />
  </div>
});

export const Label = component$<PropsOf<'label'>>((props) => {
  const { id } = useContext(FormFieldContext);
  const attr = mergeProps<'label'>(props, { class: 'he-label', for: id });
  return <label {...attr} >
    <Slot/>
  </label>
});
