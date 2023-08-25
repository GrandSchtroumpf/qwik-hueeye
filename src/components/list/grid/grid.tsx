import { $, QwikKeyboardEvent, Signal, Slot, component$, useSignal } from "@builder.io/qwik";
import { lastFocus, leaveFocus, nextFocus, previousFocus } from "../../utils";
import type { NavAttributes, UlAttributes } from "../../types";
import { mergeProps } from "../../utils/attributes";
import { usePreventKeydown } from "../../utils/keyboard";
import styles from './grid.module.scss';

const nextLine = $((root: HTMLElement, selector: string, options?: FocusOptions) => {
  const list = root.querySelectorAll<HTMLElement>(selector);
  const focusedEl = document.activeElement as HTMLElement;
  const index = Array.from(list).findIndex((el) => el === focusedEl || el.contains(focusedEl));
  const { width: rootWidth } = root.getBoundingClientRect();
  const { width: itemWidth } = list[0].getBoundingClientRect();
  const line = Math.floor(rootWidth / itemWidth);
  const nextIndex = (index + line) % list.length;
  list[nextIndex].focus(options);
});

const previousLine = $((root: HTMLElement, selector: string, options?: FocusOptions) => {
  const list = root.querySelectorAll<HTMLElement>(selector);
  const focusedEl = document.activeElement as HTMLElement;
  const index = Array.from(list).findIndex((el) => el === focusedEl || el.contains(focusedEl));
  const { width: rootWidth } = root.getBoundingClientRect();
  const { width: itemWidth } = list[0].getBoundingClientRect();
  const line = Math.floor(rootWidth / itemWidth);
  const nextIndex = (index - line + list.length) % list.length;
  list[nextIndex].focus(options);
});

export const grideys= ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
export const gridKeyboard = (selector: string = 'li > a') => ({
  onKeyDown$: $((event: QwikKeyboardEvent, el: HTMLElement) => {
    const key = event.key;
    if (key === 'ArrowRight') nextFocus(el.querySelectorAll<HTMLElement>(selector));
    if (key === 'ArrowLeft') previousFocus(el.querySelectorAll<HTMLElement>(selector));
    if (key === 'ArrowDown') nextLine(el, selector);
    if (key === 'ArrowUp') previousLine(el, selector);
    if (key === 'End') lastFocus(el.querySelectorAll<HTMLElement>(selector));
    if (key === 'Escape') leaveFocus(el);
  })
});

export const useGridKeyboard = (ref: Signal<HTMLElement | undefined>, selector: string = 'li > a') => {
  usePreventKeydown(ref, ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown']);
  return gridKeyboard(selector);
}

export const NavGrid = component$((props: NavAttributes) => {
  const rootRef = useSignal<HTMLElement>();
  const keydown = useGridKeyboard(rootRef, 'li > a');
  const attr = mergeProps<'ul'>({ class: styles.heGridList }, props, keydown);
  return <nav ref={rootRef} {...attr}>
    <Slot/>
    <Slot name="grid-end"/>
  </nav>
});

export const ActionGrid = component$((props: UlAttributes) => {
  const rootRef = useSignal<HTMLElement>();
  const keydown = useGridKeyboard(rootRef, 'li > button');
  const ulProps = mergeProps<'ul'>({ class: styles.heGridList }, keydown, props);
  return <>
    <ul ref={rootRef} role="list" {...ulProps}>
      <Slot/>
    </ul>
    <Slot name="grid-end"/>
  </>
});
