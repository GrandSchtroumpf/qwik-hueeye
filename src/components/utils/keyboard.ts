import { useVisibleTask$ } from '@builder.io/qwik';
import type { Signal, QRL } from '@builder.io/qwik';

export function usePreventKeydown<T extends HTMLElement>(
  ref: Signal<T | undefined>,
  keys: string[],
) {
  useVisibleTask$(() => {
    const handler = (event: KeyboardEvent) => {
      if (keys.includes(event.key)) {
        event.preventDefault();
      }
      else if (event.ctrlKey && keys.includes(`ctrl+${event.key}`)) {
        event.preventDefault();
      }
    }
    ref.value?.addEventListener('keydown', handler);
    return () => ref.value?.removeEventListener('keydown', handler);
  });
}

export function useKeyboard<T extends HTMLElement>(
  ref: Signal<T | undefined>,
  keys: string[],
  cb: QRL<(event: KeyboardEvent, element: T) => any>,
) {
  useVisibleTask$(() => {
    const handler = (event: KeyboardEvent) => {
      if (keys.includes(event.key)) {
        event.preventDefault();
        cb(event, ref.value!);
      }
      else if (event.ctrlKey && keys.includes(`ctrl+${event.key}`)) {
        event.preventDefault();
        cb(event, ref.value!)
      }
    }
    ref.value?.addEventListener('keydown', handler);
    return () => ref.value?.removeEventListener('keydown', handler);
  });
}