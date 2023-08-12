import type { QwikJSX} from "@builder.io/qwik";
import { useSignal, useId, $ } from "@builder.io/qwik";
import { component$, Slot, useContext, useStyles$ } from "@builder.io/qwik";
import type { FieldProps} from "../field";
import { FormFieldContext } from "../form-field/form-field";
import styles from './input.scss?inline';
import { useControllerProvider } from "../control";

type InputAttributes = Omit<QwikJSX.IntrinsicElements['input'], 'children' | 'value'>;
interface InputProps extends InputAttributes, FieldProps {
  appearance?: 'standard' | 'stack';
}

const fullMonth = (date: Date) => `${date.getMonth()}`.padStart(2, "0");
const fullDay = (date: Date) => `${date.getMonth()}`.padStart(2, "0");
const fullHour = (date: Date) => `${date.getHours()}`.padStart(2, "0");
const fullMin = (date: Date) => `${date.getMinutes()}`.padStart(2, "0");

const toHTMLMonthString = (date: Date) => `${date.getFullYear()}-${fullMonth(date)}`;
const toHTMLDateString = (date: Date) => `${date.getFullYear()}-${fullMonth(date)}-${fullDay(date)}`;
const toHTMLTimeString = (date: Date) => `${fullHour(date)}:${fullMin(date)}`;

function toValueString(type: InputAttributes['type'], value: string | number | Date) {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return value.toString();
  if (type === 'month') return toHTMLMonthString(value);
  if (type === 'date') return toHTMLDateString(value);
  if (type === 'time') return toHTMLTimeString(value);
  if (type === 'datetime-local') return `${toHTMLDateString(value)}T${toHTMLTimeString(value)}`;
  return value.toISOString();
}

export const Input = component$((props: InputProps) => {
  useStyles$(styles);
  const type = props.type;
  const id = useId();
  const { bindValue, initialValue } = useControllerProvider<string | number | Date>(props, '');
  const field = useContext(FormFieldContext, { id });
  const ref = useSignal<HTMLInputElement>();
  const onValueChange = $((e: any, input: HTMLInputElement) => {
    if (type === 'number') bindValue.value = input.valueAsNumber;
    else if (input.valueAsDate) bindValue.value = input.valueAsDate;
    else bindValue.value = input.value;
  });
  
  const value = toValueString(type, initialValue);

  return <div class="field">
    <Slot name="prefix"/>
    <input {...props} id={field.id} ref={ref} value={value} onChange$={onValueChange}/>
    <Slot name="suffix"/>
  </div>
})