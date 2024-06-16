import { $ } from "@builder.io/qwik";
import { nextFocus, previousFocus } from "../utils";

export const isSamePathname = (pathname: string, href?: string) => {
  if (href === undefined) return;
  if (pathname === href) return true;
  if (pathname === `${href}/`) return true;
  return false;
}


export const focusList = $((selector: string, e: KeyboardEvent, root: HTMLElement, options?: FocusOptions) => {
  if (e.key === 'ArrowDown' || e.key === 'ArrowRight') focusNext(selector, root, options);
  if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') focusPrevious(selector, root, options);
  if (e.key === 'Home') focusFirst(selector, root, options);
  if (e.key === 'End') focusLast(selector, root, options);
  if (e.key === 'Enter' || e.key === ' ') (e.target as HTMLElement).click();
});

export const focusFirst = $((selector: string, root: HTMLElement, options?: FocusOptions) => {
  const list = root.querySelectorAll<HTMLElement>(selector);
  list[0].focus(options);
  return list[0];
});
export const focusLast = $((selector: string, root: HTMLElement, options?: FocusOptions) => {
  const list = root.querySelectorAll<HTMLElement>(selector);
  list[list.length - 1].focus(options);
  return list[list.length - 1];
});
export const focusNext = $((selector: string, root: HTMLElement, options?: FocusOptions) => {
  const list = root.querySelectorAll<HTMLElement>(selector);
  return nextFocus(list, options);
});
export const focusPrevious = $((selector: string, root: HTMLElement, options?: FocusOptions) => {
  const list = root.querySelectorAll<HTMLElement>(selector);
  return previousFocus(list, options);
});



export const disableTab = $((root: HTMLElement, itemSelector: string) => {
  const active = document.activeElement;
  const item = root.querySelectorAll(itemSelector);
  for (let i = 0; i < item.length; i++) {
    if (active !== item[i]) item[i].setAttribute('tabindex', '-1');
  }
});
export const enableTab = $((root: HTMLElement, itemSelector: string, selectedSelector: string) => {
  const item = root.querySelector(selectedSelector) ?? root.querySelector(itemSelector);
  item?.setAttribute('tabindex', '0');
});
