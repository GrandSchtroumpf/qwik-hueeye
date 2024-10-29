import { component$, $, PropsOf, useStyles$ } from "@builder.io/qwik";
import { WithControl, extractControls, useControlProvider } from "../control";
import { mergeProps } from "../../utils/attributes";
import { useFormFieldId } from "../form-field/form-field";
import style from './textarea.scss?inline';

export const Textarea = component$<WithControl<string, PropsOf<'textarea'>>>((props) => {
  useStyles$(style);
  const { id, hasFormField } = useFormFieldId(props.id);
  const { attr, controls } = extractControls(props);
  const { control, change, name } = useControlProvider(controls);
  const merged = mergeProps<'textarea'>(attr, {
    id,
    class: 'he-textarea',
    name: name?.toString(),
    value: control.value,
    onInput$: $((e, i) => change(i.value)),
    'aria-label': hasFormField ? undefined : (props['aria-label'] || props['placeholder']),
  });

  return <textarea {...merged}></textarea>;
});
