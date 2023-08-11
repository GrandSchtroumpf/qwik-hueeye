import { $, useVisibleTask$, noSerialize } from '@builder.io/qwik';
import type { Signal, QRL } from '@builder.io/qwik';

export const exist = <T>(v?: T | null): v is T => !!v;

/** Transform any value into a default string */
export const toString = $(async (value: any): Promise<string> => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return value.toString();
  if (typeof value === 'bigint') return value.toString();
  if (Array.isArray(value)) return Promise.all(value.map(toString)).then(v => v.join());
  if (value instanceof Date) return value.toISOString();
  if ('toString' in value) return value.toString();
  return JSON.stringify(value);
});


/** Prevent default keydown */
export const useSyncEvent = <K extends keyof GlobalEventHandlersEventMap>(
  ref: Signal<HTMLElement | undefined>,
  eventName: K,
  cb: (event: GlobalEventHandlersEventMap[K]) => void
) => {
  const handler = noSerialize(cb);
  useVisibleTask$(() => {
    ref.value?.addEventListener(eventName, handler as any);
    return () => ref.value?.removeEventListener(eventName, handler as any);
  });
}



export function useOnElement<K extends keyof GlobalEventHandlersEventMap>(
  ref: Signal<HTMLElement | undefined>,
  eventName: K,
  eventQrl: QRL<(event: GlobalEventHandlersEventMap[K]) => void>
) {
  useVisibleTask$(() => {
    ref.value?.addEventListener(eventName, eventQrl);
    return () => ref.value?.removeEventListener(eventName, eventQrl);
  });
}


export function getFormValue<T>(form: HTMLFormElement) {
  const data = new FormData(form);
  const result: Record<string, any> = {};
  for (const key of data.keys()) {
    const inputs = form.querySelectorAll<HTMLInputElement>(`input[name="${key}"]`);
    const isMulti = inputs.length > 1 && Array.from(inputs).every(input => input.type === 'checkbox');
    if (isMulti) {
      setDeepValue(result, key, data.getAll(key));
    } else {
      const value = data.get(key);
      // Single checkbox value
      if (value === 'on' || value === 'off' && inputs[0].type === 'checkbox') {
        setDeepValue(result, key, value === 'on' ? true : false);
      } else {
        setDeepValue(result, key, value);
      }
    }
  }
  return result as T;
}

export function getDeepValue<T>(base?: Record<string, any>, key?: string): T | undefined {
  if (!base || !key) return;
  const [prefix, ...rest] = key.split('.');
  if (!rest.length) return base[prefix];
  if (prefix in base) return getDeepValue(base[prefix], rest.join('.'));
}

export function setDeepValue(base: Record<string, any>, key: string, value: any) {
  const [prefix, ...rest] = key.split('.');
  if (rest.length) {
    base[prefix] ||= {};
    setDeepValue(base[prefix], rest.join('.'), value);
  } else {
    base[prefix] = value;
  }
}


export function toggleAll(root: HTMLElement) {
  const checkboxes = root.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
  let amount = 0;
  for (const checkbox of checkboxes) {
    if (checkbox.checked) amount++;
  }
  const shouldCheckAll = amount !== checkboxes.length;
  for (const checkbox of checkboxes) checkbox.checked = shouldCheckAll;
}
