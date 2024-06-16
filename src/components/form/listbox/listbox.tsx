import { PropsOf, Slot, component$, createContextId, useContext, useContextProvider, useStyles$ } from "@builder.io/qwik";
import { mergeProps } from "../../utils/attributes";
import styles from './listbox.scss?inline';

const ListBoxContext = createContextId<{ multi: boolean }>('ListBox');
export const useListBoxContext = () => useContext(ListBoxContext);

interface BaseListBoxProps extends PropsOf<'ul'> {
  multi?: boolean;
}

export const ListBox = component$<BaseListBoxProps & { multi: boolean }>(({ multi, ...props }) => {
  useStyles$(styles);
  useContextProvider(ListBoxContext, { multi });
  const merged = mergeProps<'ul'>(props, {
    class: 'he-listbox',
    role: 'listbox',
    'aria-multiselectable': !!multi
  });
  return (
    <ul {...merged}>
      <Slot />
    </ul>
  )
})
