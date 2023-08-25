import { QwikKeyboardEvent, Signal, useVisibleTask$, $ } from "@builder.io/qwik";
import { firstFocus, lastFocus, nextFocus, previousFocus } from "../utils";

export const isSamePathname = (pathname: string, href?: string) => {
  if (href === undefined) return;
  if (pathname === href) return true;
  if (pathname === `${href}/`) return true;
  return false;
}

export const listNavigation = $((event: QwikKeyboardEvent, el: HTMLElement) => {
  const key = event.key;
  const orientation = el.getAttribute('aria-orientation');
  const getList = () => el.querySelectorAll<HTMLElement>('a');
  if (!orientation || orientation === 'vertical') {
    if (key === 'ArrowUp') previousFocus(getList());
    if (key === 'ArrowDown') nextFocus(getList());
  }
  if (!orientation || orientation === 'horizontal') {
    if (key === 'ArrowLeft') previousFocus(getList());
    if (key === 'ArrowRight') nextFocus(getList());
  }
  if (key === 'Home') firstFocus(getList());
  if (key === 'End') lastFocus(getList());
})

export function usePreventListKeyboard(ref: Signal<HTMLElement | undefined>) {
  useVisibleTask$(() => {
    const handler = (event: KeyboardEvent) => {
      const key = event.key;
      const orientation = ref.value?.getAttribute('aria-orientation');
      if (!orientation || orientation === 'vertical') {
        if (key === 'ArrowDown' || key === 'ArrowUp') event.preventDefault();
      }
      if (!orientation || orientation === 'horizontal') {
        if (key === 'ArrowLeft' || key === 'ArrowRight') event.preventDefault();
      }
      if (key === 'Home' || key === 'End') event.preventDefault();
    }
    ref.value?.addEventListener('keydown', handler);
    return () => ref.value?.removeEventListener('keydown', handler);
  }, { strategy: 'intersection-observer' });
}