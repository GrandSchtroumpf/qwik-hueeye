import { FormHTMLAttributes, $, Slot, component$, useTask$ } from "@builder.io/qwik";
import { useFormProvider } from "./control";
import { useSearchParamsProvider } from "../hooks/useSearchParams";
import { mergeProps } from "../utils/attributes";

type UpdateType = 'submit' | 'change' | 'input';

type FormAttribute = Omit<FormHTMLAttributes<HTMLFormElement>, 'onSubmit$'>
interface FormProps extends FormAttribute {
  updateOn?: UpdateType
}

export const SearchForm = component$(function (props: FormProps) {
  const { params, setParams } = useSearchParamsProvider();
  const { form } = useFormProvider({
    value: params.value as Record<string, string>
  });

  const updateOn = props.updateOn ?? 'submit';
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { onSubmit$, onChange$, ...attr } = props;

  const updateWith = $((updateTypes: UpdateType[]) => {
    if (updateTypes.includes(updateOn)) setParams(form)
  });


  useTask$(({ track }) => {
    track(() => new URLSearchParams(form).toString());
    updateWith(['input', 'change']);
  });

  const attributes = mergeProps<'form'>(attr as any, {
    onInput$: $(() => updateWith(['input', 'change', 'submit'])),
    onChange$: $(() => updateWith(['change', 'submit'])),
    onSubmit$: $(() => updateWith(['submit'])),
  })
  return <form {...attributes} preventdefault:submit>
    <Slot />
  </form>
})