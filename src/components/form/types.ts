import type { PropsOf, QwikIntrinsicElements } from '@builder.io/qwik';

export type GroupKeys = string | number;
export type Primitive = string | number | boolean | Date | null | undefined;
export type Serializable =
  | Primitive
  | { [key: GroupKeys]: Serializable }
  | Array<Serializable>
  | Map<GroupKeys, Serializable>
  | Set<Serializable>
  | undefined;

export type ControlGroup<T extends Serializable = Serializable> = Record<GroupKeys, T>;

export type OmitControlsAttributes = 'name' | 'children' | 'value' | 'bind:value' | 'bind:checked';
export type InputAttributes = Omit<PropsOf<'input'>, OmitControlsAttributes>;
export type FieldsetAttributes = Omit<QwikIntrinsicElements['fieldset'], 'name'>;
export type DivAttributes = QwikIntrinsicElements['div'];