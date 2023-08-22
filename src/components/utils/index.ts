import { useVisibleTask$, $, createContextId } from "@builder.io/qwik";
import type { QRL, Signal } from "@builder.io/qwik";
export * from './cssvar';
export * from './clsq';

export const StyleScopeContext = createContextId<{ scopeId: string }>('StyleScopeContext');

export function useKeyboard<T extends HTMLElement>(
  ref: Signal<T | undefined>,
  keys: string[],
  cb: QRL<(event: KeyboardEvent, element: T) => any>,
) {
  useVisibleTask$(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.ctrlKey) {
        if (keys.includes(`ctrl+${event.key}`)) {
          event.preventDefault();
          cb(event, ref.value!);
        }
      } else if (keys.includes(event.key)) {
        event.preventDefault();
        cb(event, ref.value!)
      }
    }
    ref.value?.addEventListener('keydown', handler);
    return () => ref.value?.removeEventListener('keydown', handler);
  });
}


export const ArrowsKeys = ['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft'];
export const ControlKeys = ['Enter', ' '];


export const nextFocus = $((list?: NodeListOf<HTMLElement>, options?: FocusOptions) => {
  if (!list) return;
  const focusedEl = document.activeElement as HTMLElement;
  if (!focusedEl) return list[0]?.focus();
  const index = Array.from(list).findIndex((el) => el === focusedEl || el.contains(focusedEl))
  const nextIndex = (index + 1) % list.length;
  list[nextIndex].focus(options);
});
export const focusNextInput = $((root: HTMLElement, options?: FocusOptions) => {
  const list = root.querySelectorAll('input');
  nextFocus(list, options);
});

export const previousFocus = $((list?: NodeListOf<HTMLElement>, options?: FocusOptions) => {
  if (!list) return;
  const focusedEl = document.activeElement as HTMLElement;
  if (!focusedEl) return list[list.length - 1]?.focus();
  const index = Array.from(list).findIndex((el) => el === focusedEl || el.contains(focusedEl))
  const nextIndex = (index - 1 + list.length) % list.length;
  list[nextIndex].focus(options);
});
export const focusPreviousInput = $((root: HTMLElement, options?: FocusOptions) => {
  const list = root.querySelectorAll('input');
  previousFocus(list, options);
});

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

interface Point {
  x: number;
  y: number;
}
export function relativePosition(root: Point, target: Point): Point {
  return {
    x: target.x - root.x,
    y: target.y - root.y,
  }
}

export const nextFrame = () => new Promise((res) => requestAnimationFrame(res));


export function moveActive(origin: HTMLElement, target: HTMLElement) {
  const targetBox = target.getBoundingClientRect();
  const originBox = origin.getBoundingClientRect();
  const { x, y } = relativePosition(originBox, targetBox);
  origin.style.setProperty('--active-x', `${x}px`);
  origin.style.setProperty('--active-y', `${y}px`);
  origin.style.setProperty('--active-width', `${targetBox.width}px`);
  origin.style.setProperty('--active-height', `${targetBox.height}px`);
}

export function removeActive(origin: HTMLElement) {
  origin.style.setProperty('--active-x', '0');
  origin.style.setProperty('--active-y', '0');
  origin.style.setProperty('--active-width', '0');
  origin.style.setProperty('--active-height', '0');
}


export const useOnReset = (root: Signal<HTMLElement | undefined>, handler: QRL<(...params: any[]) => any>) => {
  useVisibleTask$(() => {
    const input = root.value?.querySelector<HTMLInputElement>('input');
    if (!input?.form) return;
    // const handler = () => requestAnimationFrame(() => move(null, input));
    input.form.addEventListener('reset', handler);
    return () => input?.form?.removeEventListener('reset', handler);
  });
}