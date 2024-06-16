import { $, createContextId } from "@builder.io/qwik";
export * from './cssvar';
export * from './clsq';

export const StyleScopeContext = createContextId<{ scopeId: string }>('StyleScopeContext');

export const ArrowsKeys = ['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft'];
export const ControlKeys = ['Enter', ' '];


export const nextFocus = (list?: NodeListOf<HTMLElement>, options?: FocusOptions) => {
  if (!list) return;
  const focusedEl = document.activeElement as HTMLElement;
  if (!focusedEl) return list[0]?.focus();
  const index = Array.from(list).findIndex((el) => el === focusedEl || el.contains(focusedEl))
  const nextIndex = (index + 1) % list.length;
  list[nextIndex].focus(options);
  return list[nextIndex];
};
export const previousFocus = $((list?: NodeListOf<HTMLElement>, options?: FocusOptions) => {
  if (!list) return;
  const focusedEl = document.activeElement as HTMLElement;
  if (!focusedEl) return list[list.length - 1]?.focus();
  const index = Array.from(list).findIndex((el) => el === focusedEl || el.contains(focusedEl))
  const nextIndex = (index - 1 + list.length) % list.length;
  list[nextIndex].focus(options);
  return list[nextIndex];
});


// TODO: Remove code related to options
export const focusNextOption = $((root: HTMLElement, options?: FocusOptions) => {
  const list = root.querySelectorAll<HTMLElement>('[role="option"]');
  nextFocus(list, options);
});
export const focusPreviousOption = $((root: HTMLElement, options?: FocusOptions) => {
  const list = root.querySelectorAll<HTMLElement>('[role="option"]');
  previousFocus(list, options);
});



export const firstFocus = $((list?: NodeListOf<HTMLElement>) => {
  if (!list) return;
  list.item(0).focus();
})
export const lastFocus = $((list?: NodeListOf<HTMLElement>) => {
  if (!list) return;
  list.item(list.length-1).focus();
})


export const leaveFocus = $((root: HTMLElement, options?: FocusOptions) => {
  const focusableSelector = 'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])';
  const focusables = document.querySelectorAll<HTMLElement>(focusableSelector);
  for (const focusable of focusables) {
    if (root.compareDocumentPosition(focusable) === Node.DOCUMENT_POSITION_FOLLOWING) {
      return focusable.focus(options);
    }
  }
})
