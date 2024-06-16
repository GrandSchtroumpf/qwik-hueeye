import { component$, createContextId, Slot, useContext, useContextProvider, useSignal, useId, useStyles$, $, sync$ } from "@builder.io/qwik";
import type { Signal } from "@builder.io/qwik";
import { Popover, PopoverRoot } from "../dialog/popover";
import type { ButtonAttributes, DivAttributes, InputAttributes, MenuAttributes } from "../types";
import { nextFocus, previousFocus, clsq } from "../utils";
import { mergeProps } from "../utils/attributes";
import { Link, LinkProps } from "@builder.io/qwik-city";
import styles from './menu.scss?inline';

interface MenuContext {
  menuId: string;
  triggerId: string;
  origin: Signal<HTMLElement | undefined>;
  open: Signal<boolean>;
}

interface MenuRootContext  {
  root: Signal<HTMLElement | undefined>;
} 

const MenuRootContext = createContextId<MenuRootContext>('MenuRootContext');
const MenuContext = createContextId<MenuContext>('MenuContext');

export const MenuRoot = component$((props: DivAttributes) => {
  useStyles$(styles);
  const root = useSignal<HTMLElement>();
  useContextProvider(MenuRootContext, { root });
  return <div {...props} ref={root} class={clsq('menu-root', props.class)}>
    <Slot/>
  </div>
});


interface MenuTriggerProps extends Omit<ButtonAttributes, 'ref' | 'onClick$'> {}
export const MenuTrigger = component$((props: MenuTriggerProps) => {
  const ref = useSignal<HTMLElement>();
  const triggerId = useId();
  const menuId = useId();
  const open = useSignal(false);
  useContextProvider(MenuContext, {
    menuId: menuId,
    triggerId: triggerId,
    open,
    origin: ref
  })
  return <>
    <button {...props}
      ref={ref}
      class={clsq('menu-trigger', props.class)}
      type="button"
      id={triggerId}
      onClick$={() => open.value = true}
      aria-haspopup="menu"
      aria-controls={menuId}
    >
      <Slot />
    </button>
    <Slot name="menu"/>
  </>
});

// TODO: create ContextMenu element
// type ContextMenuTriggerProps = Omit<ButtonAttributes, 'ref' | 'onContextMenu$'>
// export const ContextMenuTrigger = component$((props: ContextMenuTriggerProps) => {
//   const { menuId, triggerId, origin, open } = useContext(MenuContext);
//   return <button {...props}
//     ref={origin}
//     id={triggerId}
//     onContextMenu$={() => open.value = true}
//     aria-haspopup="true"
//     aria-controls={menuId}
//   >
//     <Slot />
//   </button>
// });

interface MenuProps extends Omit<MenuAttributes, 'id'> {}
export const Menu = component$((props: MenuProps) => {
  const {root} = useContext(MenuRootContext);
  const { menuId, triggerId, origin, open } = useContext(MenuContext);

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

  const attr = mergeProps<'menu'>(props, {
    id: menuId,
    onKeyDown$: [preventDefault, onKeyDown$],
    class: "menu-list",
    role: "menu",
    'aria-labelledby': triggerId
  });

  return <PopoverRoot open={open}>
    <Popover origin={origin}  layer={root} position="inline" class="menu-overlay">
      <menu {...attr} id={menuId}>
        <Slot />
      </menu>
    </Popover>
  </PopoverRoot>
});


export const MenuItemBtn = component$((props: ButtonAttributes) => {
  const closeAll = $(() => document.documentElement.click());
  const attrs = mergeProps({ onClick$: closeAll, props });
  return <li role="none">
    <button type="button" role="menuitem" {...attrs}>
      <Slot/>
    </button>
  </li>
});

export const MenuItemLink = component$((props: LinkProps) => {
  const closeAll = $(() => document.documentElement.click());
  const attrs = mergeProps({ onClick$: closeAll, props });
  return <li role="none">
    <Link role="menuitem" {...attrs}>
      <Slot/>
    </Link>
  </li>
});

export const MenuItemAnchor = component$((props: LinkProps) => {
  const closeAll = $(() => document.documentElement.click());
  const attrs = mergeProps({ onClick$: closeAll, props });
  return <li role="none">
    <a role="menuitem" {...attrs}>
      <Slot/>
    </a>
  </li>
});



// We need to duplicate the code from MenuTrigger because Slot cannot be forwarded
export const MenuItemTrigger = component$((props: MenuTriggerProps) => {
  const ref = useSignal<HTMLElement>();
  const triggerId = useId();
  const menuId = useId();
  const open = useSignal(false);
  useContextProvider(MenuContext, {
    menuId: menuId,
    triggerId: triggerId,
    open,
    origin: ref
  });
  return <li role="none">
    <button {...props} 
      ref={ref}
      id={triggerId}
      role="menuitem" 
      class={clsq('menu-trigger', props.class)}
      type="button"
      onClick$={() => open.value = true}
      aria-haspopup="menu"
      aria-controls={menuId}
    >
      <Slot/>
      <svg viewBox="0 0 5 10" width="5" height="10" focusable="false" aria-hidden="true" fill="currentColor">
        <polygon points="0,0 5,5 0,10"></polygon>
      </svg>
    </button>
    <Slot name="menu"/>
  </li>
})


export const MenuGroup = component$(() => {
  const { triggerId } = useContext(MenuContext);
  return <fieldset aria-labelledby={triggerId}>
    <Slot/>
  </fieldset>
})

type RadioProps = Omit<InputAttributes, 'type' | 'children'>;
export const MenuRadio = component$((props: RadioProps) => {
  const id = useId();
  return <li class="menu-radio">
    <input id={id} role="menuitemradio" type="radio" {...props} value={props.value} />
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