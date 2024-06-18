import { $, PropsOf, Slot, component$, sync$, useStyles$ } from "@builder.io/qwik";
import { mergeProps } from "../../utils/attributes";
import { disableTab, enableTab, focusList } from "../utils";
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
    onFocusIn$: $((e, el) => disableTab(el, 'ul > li > button')),
    onFocusOut$: $((e, el) => enableTab(el, 'ul > li > button')),
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
    class: 'he-nav-list',
    onKeyDown$: [
      preventKeyDown,
      $((e, el) => focusList('a', e, el))
    ],
    onFocusIn$: $((e, el) => disableTab(el, 'nav > a')),
    onFocusOut$: $((e, el) => enableTab(el, 'nav > a', 'nav > a[aria-current="page"]')),
    'aria-orientation': props.vertical ? 'vertical' : 'horizontal'
  })
  return <nav {...merged}>
    <Slot/>
  </nav>
})
