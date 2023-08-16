import { Slot, component$, useSignal } from "@builder.io/qwik";
import { useGridKeyboard } from "../utils";
import { Link, LinkProps } from "@builder.io/qwik-city";
import { NavAnchorProps } from "../navlist/navlist";
import type { ButtonAttributes, NavAttributes, UlAttributes } from "../types";
import { clsq } from "../utils";
import styles from './gridlist.module.scss';

export const NavGrid = component$((props: NavAttributes) => {
  const rootRef = useSignal<HTMLElement>();
  useGridKeyboard(rootRef, 'li > a');
  return <nav {...props}>
    <ul role="list" class={styles.gridList} ref={rootRef}>
      <Slot/>
    </ul>
    <Slot name="grid-end"/>
  </nav>
});

export const ActionGrid = component$((props: UlAttributes) => {
  const rootRef = useSignal<HTMLElement>();
  useGridKeyboard(rootRef, 'li > button');
  return <>
    <ul role="list" {...props} class={clsq(styles.gridList, props.class)} ref={rootRef}>
      <Slot/>
    </ul>
    <Slot name="grid-end"/>
  </>
});

export const GridLink = component$((props: LinkProps) => {
  return <li>
    <Link {...props} class={clsq(styles.gridItem, props.class)}>
      <Slot/>
    </Link>
  </li>
});


export const GridAnchor = component$((props: NavAnchorProps) => {
  return <li>
    <a {...props} class={clsq(styles.gridItem, props.class)}>
      <Slot/>
    </a>
  </li>
});

export const GridButton = component$((props: ButtonAttributes) => {
  return <li>
    <button {...props} class={clsq(styles.gridItem, props.class)}>
      <Slot/>
    </button>
  </li>
});