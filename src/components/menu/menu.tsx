import { component$, createContextId, Slot, $, sync$, useStyles$ } from "@builder.io/qwik";
import type { PropsOf, Signal } from "@builder.io/qwik";
import { nextFocus, previousFocus } from "../utils";
import { mergeProps } from "../utils/attributes";
import { Link } from "@builder.io/qwik-city";
import { usePopoverProvider } from "../popover/popover";
import styles from './menu.scss?inline';

interface MenuContext {
  menuId: string;
  triggerId: string;
  rootId: string;
  layer: Signal<HTMLElement | undefined>;
}

interface MenuRootContext  {
  root: Signal<HTMLElement | undefined>;
} 

const MenuRootContext = createContextId<MenuRootContext>('MenuRootContext');
const MenuContext = createContextId<MenuContext>('MenuContext');

interface MenuTriggerProps extends PropsOf<'button'> {
  menuId: string;
}
export const MenuTrigger = component$<MenuTriggerProps>((props) => {
  const { menuId, ...buttonProps } = props;

  // TODO: bind aria-expanded without root
  const { trigger } = usePopoverProvider({
    anchorId: `anchor-${menuId}`,
    popoverId: `popover-${menuId}`,
  });
  const attr = mergeProps<'button'>(buttonProps, trigger, {
    id: `anchor-${menuId}`,
    type: 'button',
    class: 'he-menu-trigger',
    'aria-haspopup': 'menu',
  });
  return <button {...attr}>
    <Slot />
  </button>
});

interface MenuProps extends PropsOf<'menu'> {
  id: string;
}
export const Menu = component$<MenuProps>((props) => {
  useStyles$(styles);
  const { popover } = usePopoverProvider({
    anchorId: `anchor-${props.id}`,
    popoverId: `popover-${props.id}`,
  });

  const preventDefault = sync$((event: KeyboardEvent) => {
    const keys = ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'];
    if (keys.includes(event.key)) event.preventDefault();
  })
  const onKeyDown$ = $((event: KeyboardEvent, el: HTMLElement) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      nextFocus(el.querySelectorAll<HTMLElement>('button, input'))
    }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      previousFocus(el.querySelectorAll<HTMLElement>('button, input'))
    }
  });

  const attr = mergeProps<'menu'>(props, popover, {
    onKeyDown$: [preventDefault, onKeyDown$],
    class: "he-menu position-block",
    role: "menu",
    // 'aria-labelledby': triggerId // TODO
  });

  return (
    <menu {...attr}>
      <Slot />
    </menu>
  );
});


export const MenuItemBtn = component$<PropsOf<'button'>>((props) => {
  const closeAll = $(() => document.documentElement.click());
  const attrs = mergeProps<'button'>(props, { onClick$: closeAll });
  return <li role="none">
    <button type="button" role="menuitem" {...attrs}>
      <Slot/>
    </button>
  </li>
});

export const MenuItemLink = component$<PropsOf<'a'>>((props) => {
  const closeAll = $(() => document.documentElement.click());
  const attrs = mergeProps<'a'>(props, { onClick$: closeAll });
  return <li role="none">
    <Link role="menuitem" {...attrs}>
      <Slot/>
    </Link>
  </li>
});

export const MenuItemAnchor = component$<PropsOf<'a'>>((props) => {
  const closeAll = $(() => document.documentElement.click());
  const attrs = mergeProps<'a'>(props, { onClick$: closeAll });
  return <li role="none">
    <a role="menuitem" {...attrs}>
      <Slot/>
    </a>
  </li>
});

interface MenuItemTriggerProps extends PropsOf<'button'> {
  menuId: string;
}
export const MenuItemTrigger = component$<MenuItemTriggerProps>((props) => {
  const { menuId, ...attributes } = props;
  const { trigger } = usePopoverProvider({
    anchorId: `anchor-${menuId}`,
    popoverId: `popover-${menuId}`,
  });
  const attrs = mergeProps<'button'>(attributes, trigger, {
    id: `anchor-${menuId}`,
    role: 'menuitem',
    type: 'button',
    'aria-haspopup': 'menu',
  });
  return <li role="none">
    <button {...attrs}>
      <Slot/>
    </button>
  </li>
});