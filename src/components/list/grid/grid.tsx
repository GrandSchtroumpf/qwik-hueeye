import { $, Slot, component$, sync$, useStyles$ } from "@builder.io/qwik";
import { firstFocus, lastFocus, leaveFocus, nextFocus, previousFocus } from "../../utils";
import type { NavAttributes, UlAttributes } from "../../types";
import { mergeProps } from "../../utils/attributes";
import { disableTab, enableTab } from "../utils";
import styles from './grid.scss?inline';

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

export const gridKeyboard = (selector: string = 'a') => $((event: KeyboardEvent, el: HTMLElement) => {
  const key = event.key;
  if (key === 'ArrowRight') nextFocus(el.querySelectorAll<HTMLElement>(selector));
  if (key === 'ArrowLeft') previousFocus(el.querySelectorAll<HTMLElement>(selector));
  if (key === 'ArrowDown') nextLine(el, selector);
  if (key === 'ArrowUp') previousLine(el, selector);
  if (key === 'End') lastFocus(el.querySelectorAll<HTMLElement>(selector));
  if (key === 'Home') firstFocus(el.querySelectorAll<HTMLElement>(selector));
  if (key === 'Escape') leaveFocus(el);
});

export const NavGrid = component$((props: NavAttributes) => {
  useStyles$(styles);
  const preventDefault = sync$((event: KeyboardEvent) => {
    const keys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'End', 'Home'];
    if (keys.includes(event.key)) event.preventDefault();
  });

  const onKeyDown$ = gridKeyboard('a');
  const attr = mergeProps<'nav'>(props, {
    class: 'he-nav-grid',
    onKeyDown$: [preventDefault, onKeyDown$],
    onFocusIn$: $((e, el) => disableTab(el, 'nav > a')),
    onFocusOut$: $((e, el) => enableTab(el, 'nav > a', 'nav > a[aria-current="page"]'))
  });
  return <nav {...attr}>
    <Slot/>
    <Slot name="grid-end"/>
  </nav>
});

export const ActionGrid = component$((props: UlAttributes) => {
  useStyles$(styles);
  const preventDefault = sync$((event: KeyboardEvent) => {
    const keys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'End', 'Home'];
    if (keys.includes(event.key)) event.preventDefault();
  });

  const onKeyDown$ = gridKeyboard('li > button');
  const attr = mergeProps<'ul'>(props, {
    class: 'he-action-grid',
    onKeyDown$: [preventDefault, onKeyDown$],
    onFocusIn$: $((e, el) => disableTab(el, 'ul > li > button')),
    onFocusOut$: $((e, el) => enableTab(el, 'ul > li > button')),
    role: 'list',
  });
  return <>
    <ul {...attr}>
      <Slot/>
    </ul>
    <Slot name="grid-end"/>
  </>
});
