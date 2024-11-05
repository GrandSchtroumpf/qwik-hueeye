import type { Signal} from "@builder.io/qwik";
import { $, createContextId, useContext, useContextProvider, useSignal, useTask$ } from "@builder.io/qwik";
import { useLocation, useNavigate } from "@builder.io/qwik-city";
import { isServer } from "@builder.io/qwik/build";

export const number = (fallback: number) => (str?: string | null) => str ? Number(str) : fallback;
export const string = (fallback: string) => (str?: string | null) => str ?? fallback;


const fromSearchRecord = (record: Record<string, string>) => {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(record)) {
    if (key.endsWith('[]')) {
      const [prefix] = key.split('[');
      result[prefix] = value.split('_');
    } else if (key.includes('.')) {
      throw new Error('cannot parse deep object in search params');
    } else if (value === 'true' || value === 'false') {
      result[key] = value === 'true';
    } else {
      result[key] = value;
    }
  }
  return result;
}

const stringify = (value?: unknown) => {
  if (typeof value === 'undefined') return '';
  return (value as boolean | string | number | bigint).toString();
}
const stringifyArray = (value: unknown[]) => {
  if (value.some(v => typeof v === 'object' || typeof v === 'function')) return '';
  return value.map(stringify).join('_');
}

const toSearchRecord = (params: object) => {
  const record: Record<string, string> = {}
  for (const [key, value] of Object.entries(params)) {
    if (typeof value === 'function') continue;
    if (typeof value === 'symbol') continue;
    if (typeof value !== 'object') {
      record[key] = stringify(value);
    } else if (Array.isArray(value)) {
      record[`${key}[]`] = stringifyArray(value);
    } else if (value !== null) {
      const subrecord = toSearchRecord(value);
      for (const [subkey, subvalue] of Object.entries(subrecord)) {
        record[`${key}.${subkey}`] = subvalue;
      }
    } else {
      record[key] = '';
    }
  }
  return record;
}

type ParamSchema = Record<string, (str?: string | null) => Promise<unknown>>;
export type FromSchema<S extends ParamSchema> = {
  [K in keyof S]: S[K] extends (str?: string | null) => Promise<infer I> ? I : string;
}

export function getSearchParams<S extends ParamSchema>(url: URL, schema?: S) {
  if (!schema) return fromSearchRecord(Object.fromEntries(url.searchParams.entries())) as Partial<FromSchema<S>>;
  const params: Partial<FromSchema<S>> = {};
  for (const [key, transform] of Object.entries(schema)) {
    (params as any)[key] = transform(url.searchParams.get(key));
  }
  return params;
}

type SearchParamsCtx<S extends ParamSchema> = ReturnType<typeof useSearchParamsProvider<S>>;

const SearchParamsContext = createContextId<SearchParamsCtx<any>>('SearchParamsContext');

export function useSearchParamsProvider<S extends ParamSchema>(schema?: S) {
  const location = useLocation();
  const initial = getSearchParams(location.url, schema);
  const params = useSignal<Partial<FromSchema<S>>>(initial);
  const nav = useNavigate();
  useTask$(async ({ track }) => {
    const url = track(() => location.url);
    params.value = getSearchParams(url, schema);
  });

  const getParam = $((key: Extract<keyof S, string>) => {
    const value = location.url.searchParams.get(key);
    if (value === null) return;
    if (!schema) return value;
    return schema[key](value);
  });

  const setParams = $((params: Partial<FromSchema<S>>) => {
    if (isServer) return;
    const nextURL = new URL(location.url);
    let hasChanges = false;
    const search = toSearchRecord(params);
    for (const [key, value] of Object.entries(search)) {
      if (location.url.searchParams.get(key) === value) continue;
      if (!value) nextURL.searchParams.delete(key);
      if (value) nextURL.searchParams.set(key, value);
      hasChanges = true;
    }
    if (hasChanges) nav(nextURL.toString(), { replaceState: true, scroll: false });
    return params;
  });

  const ctx = {
    params: params as Signal<FromSchema<S>>,
    getParam,
    setParams,
  };

  useContextProvider(SearchParamsContext, ctx as any);
  // TODO: remove after useContext is fixed in v2.0
  useContext(SearchParamsContext);
  return ctx;
}

export function useSearchParams<S extends ParamSchema>() {
  return useContext<SearchParamsCtx<S>>(SearchParamsContext as any);
}
