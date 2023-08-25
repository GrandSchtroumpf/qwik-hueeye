import { AriaAttributes, Slot, component$, useStyles$ } from "@builder.io/qwik";
import { Link, LinkProps, useLocation } from "@builder.io/qwik-city";
import { isSamePathname } from "../utils";
import { mergeProps } from "../../utils/attributes";
import { AnchorAttributes, ButtonAttributes } from "../../types";
import style from './item.css?inline';

export const LinkItem = component$((props: LinkProps) => {
  useStyles$(style);
  const { url } = useLocation();
  const href = props.href;
  const aria: AriaAttributes = {
    'aria-current': isSamePathname(url.pathname, href) ? 'page' : null as any
  };
  return <Link {...mergeProps({ class: "he-link-item", ...aria }, props)}>
    <Slot/>
  </Link>
});


export const AnchorItem = component$((props: AnchorAttributes) => {
  useStyles$(style);
  const { url } = useLocation();
  const href = props.href;
  const aria: AriaAttributes = {
    'aria-current': isSamePathname(url.pathname, href) ? 'page' : null as any
  };
  return <a {...mergeProps({ class: "he-anchor-item",...aria }, props)}>
    <Slot/>
  </a>
});

export const ButtonItem = component$((props: ButtonAttributes) => {
  useStyles$(style);
  return <li>
    <button {...mergeProps({ class: "he-button-item" }, props)}>
      <Slot/>
    </button>
  </li>
});