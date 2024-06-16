import type { QRL, QwikFocusEvent, QwikSubmitEvent } from "@builder.io/qwik";

export type FormFieldControl = string | number | Date | boolean | undefined;
export type FormFieldArray = FormFieldControl[];
export type FormFieldRecord = Record<string, FormFieldControl | FormFieldArray>;
export type FormField = FormFieldControl | FormFieldArray | FormFieldRecord;

export type ValidateFn<T> = QRL<(value: T) => null | Record<string, any>>;
export type Validators<T> = ValidateFn<T> | ValidateFn<T>[];


export type SubmitHandler<T extends FormFieldRecord> = QRL<(values: T, event: QwikSubmitEvent<HTMLFormElement>) => unknown>;

export type EventHandler = QRL<(event: QwikFocusEvent<HTMLInputElement>, element: HTMLInputElement) => any>;



export interface DisplayProps<T = any> {
  /** 
   * Method used to customize how selected options are displayed
   */
  display$?: QRL<(value: T) => string | undefined>;
}

export * from '../types';