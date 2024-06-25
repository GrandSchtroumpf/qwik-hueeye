import { component$, createContextId, Slot, useContext, useContextProvider, useSignal, useId, useStyles$, $, sync$ } from "@builder.io/qwik";
import type { PropsOf, Signal } from "@builder.io/qwik";
import { Popover, PopoverProps, PopoverRoot, PopoverTrigger } from "../dialog/popover";
import { nextFocus, previousFocus, clsq } from "../utils";
import { mergeProps } from "../utils/attributes";
import { Link } from "@builder.io/qwik-city";
import styles from './menu.scss?inline';
import { useWithId } from "../hooks/useWithId";

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

export const MenuRoot = component$((props: PropsOf<'div'>) => {
  useStyles$(styles);
  const layer = useSignal<HTMLElement>();
  const open = useSignal(false);
  const triggerId = useId();
  const menuId = useId();
  const rootId = useWithId(props.id);
  useContextProvider(MenuContext, { menuId, triggerId, rootId, layer });
  const attr = mergeProps<'div'>(props, {
    id: rootId,
    class: 'menu-root',
  });
  return <PopoverRoot open={open}>
    <div {...attr}>
      <Slot/>
    </div>
  </PopoverRoot>
});

interface MenuPopoverProps extends Omit<PopoverProps, 'anchor'> {
  anchor?: string;
}
export const MenuPopover = component$<MenuPopoverProps>((props) => {
  const { layer, rootId } = useContext(MenuContext);
  const anchor = props.anchor ?? rootId;
  return (
    <Popover anchor={anchor} layer={layer} position="inline" class="menu-overlay">
      <Slot />
    </Popover>
  )
})

interface MenuTriggerProps extends Omit<PropsOf<'button'>, 'ref' | 'onClick$'> {}
export const MenuTrigger = component$((props: MenuTriggerProps) => {
  const { triggerId, menuId } = useContext(MenuContext);
  return <>
    <PopoverTrigger {...props}
      class={clsq('menu-trigger', props.class)}
      id={triggerId}
      aria-haspopup="menu"
      aria-controls={menuId}
    >
      <Slot />
    </PopoverTrigger>
  </>
});

// TODO: create ContextMenu element
// type ContextMenuTriggerProps = Omit<PropsOf<'button'>, 'ref' | 'onContextMenu$'>
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

export const Menu = component$((props: PropsOf<'menu'>) => {
  const { menuId, triggerId } = useContext(MenuContext);

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

  return (
    <menu {...attr}>
      <Slot />
    </menu>
  );
});


export const MenuItemBtn = component$((props: PropsOf<'button'>) => {
  const closeAll = $(() => document.documentElement.click());
  const attrs = mergeProps<'button'>(props, { onClick$: closeAll });
  return <li role="none">
    <button type="button" role="menuitem" {...attrs}>
      <Slot/>
    </button>
  </li>
});

export const MenuItemLink = component$((props: PropsOf<'a'>) => {
  const closeAll = $(() => document.documentElement.click());
  const attrs = mergeProps<'a'>(props, { onClick$: closeAll });
  return <li role="none">
    <Link role="menuitem" {...attrs}>
      <Slot/>
    </Link>
  </li>
});

export const MenuItemAnchor = component$((props: PropsOf<'a'>) => {
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
      <button {...props} role="menuitem">
        <Slot/>
      </button>
    </li>
  )
})

// // We need to duplicate the code from MenuTrigger because Slot cannot be forwarded
// export const NestedMenu = component$(() => {
//   const layer = useSignal<HTMLElement>();
//   const triggerId = useId();
//   const menuId = useId();
//   const open = useSignal(false);
//   const { rootId } = useContext(MenuContext);
//   useContextProvider(MenuContext, {
//     menuId: menuId,
//     triggerId: triggerId,
//     origin: origin,
//     layer
//   });
//   return <PopoverRoot open={open}>
//     <li role="none" ref={layer}>
//       <Slot/>
//     </li>
//   </PopoverRoot>
// });

// export const NestedMenuTrigger = component$((props: MenuTriggerProps) => {
//   const { menuId, triggerId } = useContext(MenuContext);
//   return (
//     <button {...props} 
//       id={triggerId}
//       role="menuitem" 
//       class={clsq('menu-trigger', props.class)}
//       type="button"
//       onClick$={() => open.value = true}
//       aria-haspopup="menu"
//       aria-controls={menuId}
//     >
//       <Slot/>
//       <svg viewBox="0 0 5 10" width="5" height="10" focusable="false" aria-hidden="true" fill="currentColor">
//         <polygon points="0,0 5,5 0,10"></polygon>
//       </svg>
//     </button>
//   );
// });


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
  return <li class="menu-radio">
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