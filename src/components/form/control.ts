
import {
  $,
  Signal,
  createContextId,
  useContext,
  useContextProvider,
  useStore,
  useComputed$,
  useSignal,
  untrack,
  useTask$,
} from '@builder.io/qwik';
import type { Serializable, ControlGroup } from './types';

const GroupContext = createContextId<any>('GroupContext');

const copyStore = <T>(store: T): T => {
  if (!isProxy(store)) return store;
  if (Array.isArray(store)) return store.map(copyStore) as T;
  const copy = Object.create(null);
  for (const key in store) {
    copy[key] = isProxy(store[key]) ? copyStore(store[key]) : store[key];
  }
  return copy;
}

// FORM

export interface FormControlProps<T extends object> {
  value?: T;
  'bind:value'?: T;
}
export function useFormProvider<T extends object>(props: FormControlProps<T>) {
  const { 'bind:value': bindValue, value: initial } = props;
  const store = useStore(initial ?? {} as T, { deep: true });
  const form = bindValue ?? store;
  const change = $((value: T) => {
    for (const key in value) {
      form[key] = value[key];
    }
  });
  useContextProvider(GroupContext, { control: form, change });
  return { form, change };
}

export interface ControlProps<T> {
  name?: string | number;
  value?: T;
  'bind:value'?: Signal<T | undefined>;
}

// GROUP
function fromParent<T, P extends Object = Object>(parent?: P, name?: string | number) {
  if (!parent) return;
  if (exists(name) && name in parent) return (parent as any)[name] as T;
}
function fromParentStore<T, P extends Object = Object>(parent?: P, name?: string | number) {
  if (!parent) return;
  if (!isProxy(parent)) return;
  return fromParent<T, P>(parent, name);
}
function exists<T>(value?: T | null): value is T {
  return (value !== undefined && value !== null);
}
function isProxy<T>(parent: T) {
  try {
    structuredClone(parent);
    return false;
  } catch {
    return true;
  }
}


type GroupControlCtx<T extends Serializable> = {
  control: ControlGroup;
  change: (value: Partial<T>) => void;
  name?: string | number;
};
export interface ControlGroupProps<T = ControlGroup> {
  name?: string | number;
  value?: T;
  'bind:value'?: T;
}
export function useGroupControlProvider<T extends ControlGroup>(
  props: ControlGroupProps<T>
) {
  const { name, 'bind:value': bindValue, value } = props;
  const { control: parent } = useGroupControl<T>();
  const initial = untrack(() => fromParent<T>(parent, name) ?? value ?? {} as T);
  const store = useStore(copyStore(initial));
  const control = bindValue ?? fromParentStore<T>(parent, name) ?? store;
  
  useTask$(() => {
    if (parent && name) parent[name] ||= initial;
  });

  const change = $((value: Partial<T>) => {
    const group = bindValue ?? fromParentStore<ControlGroup>(parent, name) ?? store;
    if (!group) return;
    for (const key in value) {
      group[key] = value[key];
    }
  });
  const ctx = { control, change, name };
  useContextProvider(GroupContext, ctx);
  return ctx;
}

export function useGroupControl<T extends Serializable>(): GroupControlCtx<T> {
  return useContext(GroupContext, {});
}


// LIST
type ListControlCtx<T extends Serializable> = ReturnType<typeof useListControlProvider<T>>
export const ListControlContext = createContextId<ListControlCtx<any>>('ListControlContext');

export interface ControlListProps<T> {
  name?: string | number;
  value?: T[];
  'bind:value'?: T[];
}
export function useListControlProvider<T extends Serializable>(props: ControlListProps<T>) {
  const { name, 'bind:value': bindValue, value } = props;
  const { control: parent } = useGroupControl<T[]>();
  const initial = untrack(() => fromParent<T[]>(parent, name) ?? value ?? [] as T[]);
  const store = useStore(copyStore(initial));
  const control = bindValue ?? fromParent<T[]>(parent, name) ?? store;
  const list = useComputed$(() => control);

  useTask$(() => {
    if (parent && name) parent[name] ||= initial;
  });

  const set = $((value: T[]) => {
    if (bindValue) bindValue.splice(0, bindValue.length, ...value);
    else if (isProxy(parent) && exists(name)) parent[name] = [...value];
    else store.splice(0, store.length, ...value);
  })
  const add = $((item: T) => {
    if (bindValue) {
      bindValue.push(item);
    } else if (isProxy(parent) && exists(name)) {
      parent[name] ||= [];
      (parent[name] as T[]).push(item);
    } else {
      store.push(item);
    }
  });
  const removeAt = $(async (index: number) => {
    if (bindValue) {
      bindValue.splice(index, 1);
    } else if (isProxy(parent) && exists(name)) {
      (parent[name] as T[]).splice(index, 1);
    } else {
      store.splice(index, 1);
    }
  });
  const remove = $((item: T) => {
    const index = list.value.indexOf(item);
    removeAt(index);
  });
  const clear = $(() => {
    if (bindValue) bindValue.splice(0, bindValue.length);
    else if (isProxy(parent) && exists(name)) parent[name] = [];
    else store.splice(0, store.length);
  });

  const ctx = { list, add, remove, removeAt, clear, set, name };
  
  useContextProvider(GroupContext, { control, name });
  useContextProvider(ListControlContext, ctx);
  return ctx;
}
export function useListControl<T extends Serializable>() {
  return useContext<ListControlCtx<T>>(ListControlContext);
}

// CONTROL
const ControlContext = createContextId<ControlCtx<any>>('ControlContext');
type ControlCtx<T extends Serializable> = ReturnType<typeof useControlProvider<T>>;
export function useControlProvider<T extends Serializable>(props: ControlProps<T>, fallback?: T) {
  const { name, 'bind:value': bindValue, value } = props;
  const { control: parent } = useGroupControl<T | undefined>();
  const initial = untrack(() => fromParent<T>(parent, name) ?? value ?? fallback);
  const signal = useSignal<T | undefined>(initial);

  useTask$(() => {
    if (parent && name) parent[name] ||= initial;
  });

  // Input
  const control: Readonly<Signal<T | undefined>> = useComputed$(() => {
    return bindValue?.value ?? fromParentStore<T>(parent, name) ?? signal.value;
  });

  // Output
  const change = $((value: T | undefined) => {
    if (bindValue) bindValue.value = value;
    else if (isProxy(parent) && exists(name)) parent[name] = value;
    else signal.value = value;
  });

  const ctx = { parent, control, change, name };
  useContextProvider<ControlCtx<T>>(ControlContext, ctx);
  return ctx;
}

export function useControl<T extends Serializable>() {
  return useContext<ControlCtx<T>>(ControlContext)
}

// ITEM 
export interface ControlItemProps<T> {
  value: T;
}


export type WithControl<V, Attr> = Omit<Attr, keyof ControlProps<V>> & ControlProps<V>;
export type WithControlList<V, Attr> = Omit<Attr, keyof ControlProps<V>> & ControlListProps<V>;
export type WithControlGroup<V, Attr> = Omit<Attr, keyof ControlProps<V>> & ControlGroupProps<V>;
export type WithControlProps<V, Attr> = WithControl<V, Attr> | WithControlList<V, Attr> | WithControlGroup<V, Attr>;

type Extracted<Attr, Control> = { attr: Attr; controls: Control };

export function extractControls<V, Attr>(props: WithControl<V, Attr>): Extracted<Attr, ControlProps<V>>
export function extractControls<V, Attr>(props: WithControlList<V, Attr>): Extracted<Attr, ControlListProps<V>>
export function extractControls<V, Attr>(props: WithControlGroup<V, Attr>): Extracted<Attr, ControlGroupProps<V>>
export function extractControls<V, Attr>(props: WithControlProps<V, Attr>) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { value, 'bind:value': bindValue, name, ...attr } = props;
  const controls: any = {};
  if (exists(value)) controls.value = value;
  if (bindValue) controls['bind:value'] = bindValue;
  if (exists(name)) controls.name = name;
  return { attr, controls } as any;
}
