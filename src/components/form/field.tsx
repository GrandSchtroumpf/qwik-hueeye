import { createContextId, useComputed$, useContext, useId } from "@builder.io/qwik";
import type { QRL, QwikChangeEvent} from "@builder.io/qwik";
import type { FormField } from "./types";

export interface FieldProps<T = any> {
  name?: string;
  value?: T;
  required?: boolean;
  onChange$?: QRL<(value: T) => void>;
}

export interface FieldState<T extends FormField = any> {
  name: string;
  initialValue?: T;
  value?: T;
  dirty?: boolean;
  invalid?: boolean;
  focused?: boolean;
  touched?: boolean;
  disabled?: boolean;
  change: QRL<(event: QwikChangeEvent<HTMLInputElement>, input: HTMLInputElement) => void>;
}

export const FieldContext = createContextId<FieldState<any>>('FieldContext');

export const useFieldClass = (state: FieldState<any>, ...classes: string[]) => {
  return useComputed$(() => ([
    state.focused ? 'focused' : '',
    state.touched ? 'touched' : '',
    state.dirty ? 'dirty' : '',
    state.invalid ? 'invalid' : '',
    ...classes
  ].join(' ')));
}

export const FieldGroupContext = createContextId<{ name?: string }>('FieldGroupContext');
/** Get name from the group if any */
export const useGroupName = (props: { name?: string }) => {
  if (props.name) return props.name;
  const { name } = useContext(FieldGroupContext, { name: null });
  return name ?? useId();
}

/** Combine name from the group */
export const useRecordName = (props: { name?: string }) => {
  const nameId = props.name ?? useId();
  const { name: groupName } = useContext(FieldGroupContext, { name: null});
  if (!groupName) return nameId;
  return `${groupName}.${nameId}`;
}

// export function useFormField<T extends FormFieldRecord, N extends Extract<keyof T, string> = Extract<keyof T, string>>(name: N) {
//   const form = useForm<T>();
//   const initialValue = form?.value[name];
//   const state = useStore<FieldState<T[N]>>({
//     name,
//     initialValue,
//     value: initialValue,
//     dirty: false,
//     invalid: false,
//     focused: false,
//     touched: false,
//     disabled: false,
//   });
//   useTask$(({ track }) => {
//     track(() => state.value);
//     form.value[name] = state.value!;
//     form.updateCount = form.updateCount + 1;
//   });
//   useTask$(({ track }) => {
//     track(() => form.updateCount);
//     state.value = form.value[name];
//   });
//   useContextProvider(FieldContext, state);

//   return state;
// }

// export function useControl<T extends FormField>(value: T) {
//   const name = useId();
//   const state = useStore<FieldState<T>>({
//     name,
//     initialValue: value,
//     value: value,
//     dirty: false,
//     invalid: false,
//     focused: false,
//     touched: false,
//     disabled: false,
//   });

//   useContextProvider(FieldContext, state);
//   return state;
// }



// export function useField<T extends FormField>(props: FieldProps<T> = {}) {
//   if (props.name) return useFormField(props.name);
//   return useControl(props.value);
// }
