import { AriaAttributes, Slot, component$, useSignal } from "@builder.io/qwik";
import { NavAttributes, UlAttributes } from "../../types";
import { mergeProps } from "../../utils/attributes";
import { listNavigation, usePreventListKeyboard } from "../utils";

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

interface ListProps {
  horizontal?: boolean;
}

interface ActionListProps extends UlAttributes, ListProps {}
export const ActionList = component$((props: ActionListProps) => {
  const ref = useSignal<HTMLElement>();
  usePreventListKeyboard(ref);
  const aria: AriaAttributes = {
    'aria-orientation': props.horizontal ? 'horizontal' : 'vertical'
  }
  const attributes = mergeProps({ class: 'he-action-list', onKeyDown$: listNavigation, ...aria }, props);
  return <ul ref={ref} role="list" {...attributes}>
    <Slot/>
  </ul>
})

interface NavListProps extends NavAttributes, ListProps {}
export const NavList = component$((props: NavListProps) => {
  const ref = useSignal<HTMLElement>();
  usePreventListKeyboard(ref);
  const aria: AriaAttributes = {
    'aria-orientation': props.horizontal ? 'horizontal' : 'vertical'
  }
  const attributes = mergeProps({ class: 'he-nav-list', onKeyDown$: listNavigation, ...aria }, props)
  return <nav ref={ref} {...attributes}>
    <Slot/>
  </nav>
})
