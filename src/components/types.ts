import type { QwikIntrinsicElements } from "@builder.io/qwik";

export type HTMLAttributes<T extends keyof QwikIntrinsicElements> = QwikIntrinsicElements[T];

export type DivAttributes = QwikIntrinsicElements['div'];
export type ButtonAttributes = QwikIntrinsicElements['button'];
export type MenuAttributes = QwikIntrinsicElements['menu'];
export type UlAttributes = QwikIntrinsicElements['ul'];
export type LiAttributes = QwikIntrinsicElements['li'];
export type FieldsetAttributes = QwikIntrinsicElements['fieldset'];
export type InputAttributes = QwikIntrinsicElements['input'];
export type DialogAttributes = QwikIntrinsicElements['dialog'];
export type NavAttributes = QwikIntrinsicElements['nav'];
export type AnchorAttributes = QwikIntrinsicElements['a'];
