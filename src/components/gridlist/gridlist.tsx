import { $, QwikKeyboardEvent, Signal, Slot, component$, useSignal } from "@builder.io/qwik";
import { lastFocus, leaveFocus, nextFocus, previousFocus } from "../utils";
import { Link, LinkProps } from "@builder.io/qwik-city";
import { NavAnchorProps } from "../navlist/navlist";
import type { ButtonAttributes, NavAttributes, UlAttributes } from "../types";
import styles from './gridlist.module.scss';
import { mergeProps } from "../utils/attributes";
import { usePreventKeydown } from "../utils/keyboard";

export const nextLine = $((root: HTMLElement, selector: string) => {
  const list = root.querySelectorAll<HTMLElement>(selector);
  const focusedEl = document.activeElement as HTMLElement;
  const index = Array.from(list).findIndex((el) => el === focusedEl || el.contains(focusedEl));
  const { width: rootWidth } = root.getBoundingClientRect();
  const { width: itemWidth } = list[0].getBoundingClientRect();
  const line = Math.floor(rootWidth / itemWidth);
  const nextIndex = (index + line) % list.length;
  list[nextIndex].focus();
});

export const previousLine = $((root: HTMLElement, selector: string) => {
  const list = root.querySelectorAll<HTMLElement>(selector);
  const focusedEl = document.activeElement as HTMLElement;
  const index = Array.from(list).findIndex((el) => el === focusedEl || el.contains(focusedEl));
  const { width: rootWidth } = root.getBoundingClientRect();
  const { width: itemWidth } = list[0].getBoundingClientRect();
  const line = Math.floor(rootWidth / itemWidth);
  const nextIndex = (index - line + list.length) % list.length;
  list[nextIndex].focus();
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
  const ulProps = mergeProps<'ul'>({ class: styles.gridList }, keydown);
  return <nav {...props}>
    <ul ref={rootRef} role="list" {...ulProps}>
      <Slot/>
    </ul>
    <Slot name="grid-end"/>
  </nav>
});

export const ActionGrid = component$((props: UlAttributes) => {
  const rootRef = useSignal<HTMLElement>();
  const keydown = useGridKeyboard(rootRef, 'li > button');
  const ulProps = mergeProps<'ul'>({ class: styles.gridList }, keydown, props);
  return <>
    <ul ref={rootRef} role="list" {...ulProps}>
      <Slot/>
    </ul>
    <Slot name="grid-end"/>
  </>
});

export const GridLink = component$((props: LinkProps) => {
  return <li>
    <Link {...mergeProps({ class: styles.gridItem }, props)}>
      <Slot/>
    </Link>
  </li>
});


export const GridAnchor = component$((props: NavAnchorProps) => {
  return <li>
    <a {...mergeProps({ class: styles.gridItem }, props)}>
      <Slot/>
    </a>
  </li>
});

export const GridButton = component$((props: ButtonAttributes) => {
  return <li>
    <button {...mergeProps({ class: styles.gridItem }, props)}>
      <Slot/>
    </button>
  </li>
});