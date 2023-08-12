import { Slot, component$, useSignal, useStyles$ } from "@builder.io/qwik";
import { useGridKeyboard } from "../utils";
import { Link, LinkProps } from "@builder.io/qwik-city";
import { NavAnchorProps } from "../navlist/navlist";
import styles from './navgrid.scss?inline';

export const NavGrid = component$(() => {
  useStyles$(styles)
  const rootRef = useSignal<HTMLElement>();
  useGridKeyboard(rootRef, 'li > a');
  return <nav class="nav-grid">
    <ul role="list" ref={rootRef}>
      <Slot/>
    </ul>
    <Slot name="nav-grid-end"/>
  </nav>
});

export const NavItemLink = component$((props: LinkProps) => {
  return <li>
    <Link {...props}>
      <Slot/>
    </Link>
  </li>
});


export const NavItemAnchor = component$((props: NavAnchorProps) => {
  return <li>
    <a {...props}>
      <Slot/>
    </a>
  </li>
});