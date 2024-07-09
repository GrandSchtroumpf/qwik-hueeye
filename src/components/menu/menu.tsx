import { component$, createContextId, Slot, useContext, useId, $, sync$, useStyles$ } from "@builder.io/qwik";
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
    class: "he-menu",
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


export const MenuItemTrigger = component$<PropsOf<'button'>>((props) => {
  return (
    <li role="none">
      <button {...props} role="menuitem" type="button">
        <Slot/>
      </button>
    </li>
  )
});

export const MenuGroup = component$(() => {
  const { triggerId } = useContext(MenuContext);
  return <fieldset aria-labelledby={triggerId}>
    <Slot/>
  </fieldset>
})

export const MenuRadio = component$((props: Omit<PropsOf<'input'>, 'children'>) => {
  const id = useId();
  const attr = mergeProps<'input'>(props as any, {
    id,
    type: 'radio',
    role: 'menuitemradio',
  })
  return <li class="he-menu-radio">
    <input {...attr} />
    <label for={id}>
      <svg focusable="false" viewBox="0 0 24 24" aria-hidden="true">
        <circle r="8" cx="12" cy="12"/>
      </svg>
      <Slot/>
    </label>
  </li>
});


export const MenuCheckbox = component$(() => {
  // TODO 
  return <li role="menuitemcheckbox">
  </li>
});