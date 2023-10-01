import { Slot, component$, useSignal, useStyles$ } from "@builder.io/qwik";
import { NavAttributes, UlAttributes } from "../../types";
import { mergeProps } from "../../utils/attributes";
import { listNavigation, usePreventListKeyboard } from "../utils";
import styles from './list.scss?inline';

// const ListContext = createContextId('ListContext');
// function useListProvider<T, Filter>(inital: T[] = []) {
//   const state = useSignal<T[]>([]);
//   const filters = useSignal<Filter>({});
//   const add = $((item: T, index: number) => {
//     const copy = structuredClone(state.value);
//     copy.splice(index, 0, item);
//     state.value = copy;
//   });
//   const remove = $((index: number) => {
//     const copy = structuredClone(state.value);
//     copy.splice(index, 0);
//     state.value = copy;
//   });

//   return {
//     add,
//     remove,
//   }
// }

interface ListProps {}

interface ActionListProps extends UlAttributes, ListProps {}
export const ActionList = component$((props: ActionListProps) => {
  useStyles$(styles);
  const ref = useSignal<HTMLElement>();
  usePreventListKeyboard(ref);
  const attributes = mergeProps({ class: 'he-action-list', onKeyDown$: listNavigation }, props);
  return <ul ref={ref} role="list" {...attributes}>
    <Slot/>
  </ul>
})

interface NavListProps extends NavAttributes, ListProps {}
export const NavList = component$((props: NavListProps) => {
  useStyles$(styles);
  const ref = useSignal<HTMLElement>();
  usePreventListKeyboard(ref);
  const attributes = mergeProps({ class: 'he-nav-list', onKeyDown$: listNavigation }, props)
  return <nav ref={ref} {...attributes}>
    <Slot/>
  </nav>
})
