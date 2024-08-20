import { $, PropsOf, Slot, component$, createContextId, sync$, useContext, useContextProvider, useStyles$ } from "@builder.io/qwik";
import { mergeProps } from "../../utils/attributes";
import { focusList } from "../../list/utils";
import { focusInOptionList, focusOutOptionList } from "../option/option";
import styles from './listbox.scss?inline';

const ListBoxContext = createContextId<{ multi: boolean }>('ListBox');
export const useListBoxContext = () => useContext(ListBoxContext);

interface BaseListBoxProps extends PropsOf<'ul'> {
  multi?: boolean;
}

export const flipListbox = $((listbox: HTMLElement) => {
  const items: Record<string, number> = {};
  const { height } = listbox.getBoundingClientRect();
  for (const option of listbox.querySelectorAll('[role="option"]:not([hidden])')) {
    items[option.id] = option.getBoundingClientRect().top;
  }
  const run = async () => {
    const options = listbox.querySelectorAll('[role="option"]:not([hidden])');
    if (options.length === Object.keys(items).length) return requestAnimationFrame(run);
    
    const { height: newHeight } = listbox.getBoundingClientRect();
    for (const option of options) {
      if (option.id in items) {
        const delta = items[option.id] - option.getBoundingClientRect().top;
        option.animate([
          { transform: `translateY(${delta}px)` },
          { transform: 'translateY(0)' }
        ], { duration: 100 });
      } else {
        option.animate([
          { opacity: 0, transform: 'scale(0.9)' },
          { opacity: 1, transform: 'scale(1)' }
        ], { duration: 100 });
      }
    }
    if (height === newHeight) return;
    const animate = listbox.animate([
      { height: `${height}px` },
      { height: `${newHeight}px` }
    ], { duration: 100 });
    listbox.style.setProperty('overflow', 'hidden');
    await animate.finished;
    listbox.style.removeProperty('overflow');
  }
  requestAnimationFrame(run);
});

const preventKeyDown = sync$((e: KeyboardEvent) => {
  const keys = ['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Enter', ' ', 'Home', 'End'];
  if (keys.includes(e.key)) return e.preventDefault();
  if (e.ctrlKey && e.key === 'a') return e.preventDefault();
});

export const ListBox = component$<BaseListBoxProps>(({ multi, ...props }) => {
  useStyles$(styles);
  useContextProvider(ListBoxContext, { multi });

  const toggleAll = $((root: HTMLElement) => {
    const options = Array.from(root.querySelectorAll<HTMLElement>('[role="option"]'));
    const allChecked = options.every(option => option.ariaChecked === 'true');
    for (let i = 0; i < options.length; i++) {
      if (!allChecked && options[i].ariaChecked === 'true') continue;
      options[i].click();
    }
  });

  const onKeyDown = $((e: KeyboardEvent, el: HTMLElement) => {
    focusList('[role="option"]', e, el);
    if (multi && e.ctrlKey && e.key === 'a') toggleAll(el);
  })
  const merged = mergeProps<'ul'>(props, {
    class: 'he-listbox',
    role: 'listbox',
    onKeyDown$: [preventKeyDown, onKeyDown],
    onFocusIn$: focusInOptionList,
    onFocusOut$: focusOutOptionList,
    'aria-multiselectable': !!multi
  });
  return (
    <ul {...merged}>
      <Slot />
    </ul>
  )
})
