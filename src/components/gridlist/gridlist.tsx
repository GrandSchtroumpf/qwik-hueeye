import { Slot, component$, useSignal } from "@builder.io/qwik";
import { useGridKeyboard } from "../utils";
import { Link, LinkProps } from "@builder.io/qwik-city";
import { NavAnchorProps } from "../navlist/navlist";
import { ButtonAttributes } from "../types";
import styles from './gridlist.module.scss';

export const NavGrid = component$(() => {
  const rootRef = useSignal<HTMLElement>();
  useGridKeyboard(rootRef, 'li > a');
  return <nav>
    <ul class={styles['grid-list']} role="list" ref={rootRef}>
      <Slot/>
    </ul>
    <Slot name="grid-end"/>
  </nav>
});

export const ActionGrid = component$(() => {
  const rootRef = useSignal<HTMLElement>();
  useGridKeyboard(rootRef, 'li > button');
  return <>
    <ul role="list" class={styles['grid-list']} ref={rootRef}>
      <Slot/>
    </ul>
    <Slot name="grid-end"/>
  </>
});

export const GridLink = component$((props: LinkProps) => {
  return <li>
    <Link class={styles['grid-item']} {...props}>
      <Slot/>
    </Link>
  </li>
});


export const GridAnchor = component$((props: NavAnchorProps) => {
  return <li>
    <a class={styles['grid-item']} {...props}>
      <Slot/>
    </a>
  </li>
});

export const GridButton = component$((props: ButtonAttributes) => {
  return <li>
    <button class={styles['grid-item']} {...props}>
      <Slot/>
    </button>
  </li>
});