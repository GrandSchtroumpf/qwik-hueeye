import { $, Signal, component$, createContextId, useComputed$, useContext, useContextProvider, useStore } from "@builder.io/qwik";

type Keys = string | number;
type Primitive = string | number | boolean | Date | null | undefined;
type Serializable = Primitive | { [key: Keys]:Primitive } | Array<Serializable> | Map<Keys, Serializable> | Set<Serializable>;

type ControlGroup = Record<Keys, Serializable>;

const GroupContext = createContextId<any>('GroupContext');
export function useFormProvider<T extends Object>(initial: T) {
  const value = useStore<T>(initial, { deep: true });
  useContextProvider(GroupContext, value);
}

export function useGroupControl<P extends ControlGroup, T extends Object>(name: keyof P, initial: T) {
  const parent = useContext<P, P>(GroupContext, {} as P);
  const bindValue = useStore(initial);
  const value = parent[name] ?? bindValue;
  useContextProvider(GroupContext, value);
  return value;
}

interface Props {
  name?: string;
  value?: string;
  'bind:value'?: Signal<string>
}

type InputParent = Record<string, string>;
export const Input = component$((props: Props) => {
  const name = props.name;
  const bindValue = props['bind:value'];
  const parent = useContext<InputParent, InputParent>(GroupContext, {});

  // Input
  const value = useComputed$(() => {
    if (bindValue) return bindValue?.value;
    if (parent && name) return parent[name];
    return props.value;
  });

  // Output
  const onChange = $((event: any, input: HTMLInputElement) => {
    if (bindValue) bindValue.value = input.value;
    if (parent && name) parent[name] = input.value;
  })

  return <input value={value.value} onInput$={onChange} />
})