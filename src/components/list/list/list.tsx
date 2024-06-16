import { $, PropsOf, Slot, component$, sync$, useStyles$ } from "@builder.io/qwik";
import { mergeProps } from "../../utils/attributes";
import { focusList } from "../utils";
import styles from './list.scss?inline';

const preventKeyDown = sync$((e: KeyboardEvent) => {
  const keys = ['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft', 'Home', 'End'];
  if (keys.includes(e.key)) e.preventDefault();
})

export const ActionList = component$((props: PropsOf<'ul'>) => {
  useStyles$(styles);
  const merged = mergeProps<'ul'>(props, {
    role: 'list',
    class: 'he-action-list',
    onKeyDown$: [
      preventKeyDown,
      $((e, el) => focusList('button', e, el))
    ],
  });
  return <ul {...merged}>
    <Slot/>
  </ul>
})

interface NavListProps extends PropsOf<'nav'> {
  vertical?: boolean;
}

export const NavList = component$((props: NavListProps) => {
  useStyles$(styles);
  const merged = mergeProps<'nav'>(props, {
    role: 'list',
    class: 'he-nav-list',
    onKeyDown$: [
      preventKeyDown,
      $((e, el) => focusList('a', e, el))
    ],
    'aria-orientation': props.vertical ? 'vertical' : 'horizontal'
  })
  return <nav {...merged}>
    <Slot/>
  </nav>
})
