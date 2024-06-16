import { PropsOf, Slot, component$, useStyles$ } from "@builder.io/qwik";
import { Link, LinkProps, useLocation } from "@builder.io/qwik-city";
import { isSamePathname } from "../utils";
import { mergeProps } from "../../utils/attributes";
import style from './item.scss?inline';

export const LinkItem = component$((props: LinkProps) => {
  useStyles$(style);
  const { url } = useLocation();
  const href = props.href;
  const attributes = mergeProps<'a'>(props, {
    class: "he-item he-item-link",
    'aria-current': isSamePathname(url.pathname, href) ? 'page' : null as any
  });
  return <Link {...attributes}>
    <Slot/>
  </Link>
});


export const AnchorItem = component$((props: PropsOf<'a'>) => {
  useStyles$(style);
  const { url } = useLocation();
  const href = props.href;
  const attributes = mergeProps<'a'>(props, {
    class: "he-item he-item-anchor",
    'aria-current': isSamePathname(url.pathname, href) ? 'page' : null as any
  });
  return <a {...attributes}>
    <Slot/>
  </a>
});

export const ButtonItem = component$((props: PropsOf<'button'>) => {
  useStyles$(style);
  const attributes = mergeProps<'button'>(props, {
    class: "he-item he-item-button"
  });
  return <li>
    <button {...attributes}>
      <Slot/>
    </button>
  </li>
});