import { $, PropsOf, Slot, component$, createContextId, sync$, useContext, useContextProvider, useStyles$ } from "@builder.io/qwik";
import { mergeProps } from "../../utils/attributes";
import styles from './listbox.scss?inline';
import { focusList } from "../../list/utils";
import { focusInOptionList, focusOutOptionList } from "../option/option";

const ListBoxContext = createContextId<{ multi: boolean }>('ListBox');
export const useListBoxContext = () => useContext(ListBoxContext);

interface BaseListBoxProps extends PropsOf<'ul'> {
  multi?: boolean;
}

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
