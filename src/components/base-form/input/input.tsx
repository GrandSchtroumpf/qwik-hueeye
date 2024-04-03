import { component$, $, PropsOf, useStyles$ } from "@builder.io/qwik";
import { WithControl, extractControls, useControlProvider } from "../control";
import { mergeProps } from "../../utils/attributes";
import { useFormFieldId } from "../form-field/form-field";
import style from './input.scss?inline';

export type InputValue = string | number | Date;

const fullMonth = (date: Date) => `${date.getMonth() + 1}`.padStart(2, "0");
const fullDay = (date: Date) => `${date.getDate()}`.padStart(2, "0");
const fullHour = (date: Date) => `${date.getHours()}`.padStart(2, "0");
const fullMin = (date: Date) => `${date.getMinutes()}`.padStart(2, "0");

const toHTMLMonthString = (date: Date) => `${date.getFullYear()}-${fullMonth(date)}`;
const toHTMLDateString = (date: Date) => `${date.getFullYear()}-${fullMonth(date)}-${fullDay(date)}`;
const toHTMLTimeString = (date: Date) => `${fullHour(date)}:${fullMin(date)}`;

function toValueString(type: PropsOf<'input'>['type'], value?: InputValue) {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return value.toString();
  if (type === 'month') return toHTMLMonthString(value);
  if (type === 'date') return toHTMLDateString(value);
  if (type === 'time') return toHTMLTimeString(value);
  if (type === 'datetime-local') return `${toHTMLDateString(value)}T${toHTMLTimeString(value)}`;
  return value.toISOString();
}

export type InputProps = WithControl<InputValue, PropsOf<'input'>>;
export const Input = component$<WithControl<InputValue, PropsOf<'input'>>>((props) => {
  useStyles$(style);
  const { id, hasFormField } = useFormFieldId(props.id);
  const { attr, controls } = extractControls(props);
  const { control, onChange, name } = useControlProvider(controls);
  const type = props.type ?? 'text';
  const merged = mergeProps<'input'>(attr, {
    id,
    class: 'he-input',
    name: name?.toString(),
    value: toValueString(type, control.value),
    type,
    onInput$: $((e, i) => {
      if (type === 'number') onChange(i.valueAsNumber);
      else if (type === 'date' && i.valueAsDate) onChange(i.valueAsDate);
      else if (type === 'datetime-local' && i.value) onChange(new Date(i.value));
      else onChange(i.value);
    }),
    'aria-label': hasFormField ? undefined : (props['aria-label'] || props['placeholder']),
  });

  return <input {...merged} />;
});
