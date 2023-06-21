import { $, component$, createContextId, Slot, useId, useSignal, useVisibleTask$, useStyles$ } from "@builder.io/qwik";
import type { Signal, QRL } from '@builder.io/qwik';
import type { UlAttributes } from "../types";
import { exist, useOnElement } from "../utils";
import { useStore } from "@builder.io/qwik";
import { useComputed$ } from "@builder.io/qwik";
import { useContext } from "@builder.io/qwik";
import { useContextProvider } from "@builder.io/qwik";
import { ArrowsKeys } from "../../utils";
import styles from './listbox.scss?inline';

const preventKeys = [...ArrowsKeys, 'Enter', ' '];

interface ListboxState {
  active: string;
  selected: string[];
  multiple: boolean;
}
interface ListboxService {
  state: ListboxState;
  select: QRL<(id: string) => any>
}
const ListboxContext = createContextId<ListboxService>('ListboxContext');

interface ListboxProps extends Omit<UlAttributes, 'role'>{
  controller?: Signal<HTMLElement | undefined>;
  multiple?: boolean;
  onSelected$?: QRL<(value: string | string[]) => any>
}
export const Listbox = component$((props: ListboxProps) => {
  useStyles$(styles);
  const ref = useSignal<HTMLElement>();
  // Set tabIndex to -1 for the blur event to catch the element in the relatedTarget field
  const tabIndex = props.controller ? undefined : 0;
  const controller = props.controller ?? ref;
  const onSelected$ = props.onSelected$;
  const state = useStore<ListboxState>({
    active: '',
    selected: [],
    multiple: props.multiple ?? false
  });
  const select = $((id: string) => {
    if (!id) return;
    state.selected = state.selected.includes(id)
      ? state.selected.filter(selected => selected !== id)
      : state.selected.concat(id);
    if (onSelected$) {
      const values: string[] = state.selected
        .map(id => document.getElementById(id)?.dataset.value)
        .filter(exist);
      state.multiple ? onSelected$(values) : onSelected$(values[0]);
    }
  })
  useContextProvider(ListboxContext, {state, select});

  useVisibleTask$(({ track }) => {
    track(() => state.active);
    if (!state.active) return;
    const ul = ref.value;
    const el = document.getElementById(state.active);
    if (ul && el) {
      const origin = ul.getBoundingClientRect();
      const { width, height, top, left } = el.getBoundingClientRect();
      ul.style.setProperty('--active-width', `${width}px`);
      ul.style.setProperty('--active-height', `${height}px`);
      ul.style.setProperty('--active-left', `${Math.floor(left - origin.left)}px`);
      ul.style.setProperty('--active-top', `${Math.floor(top - origin.top)}px`);
      ul.style.setProperty('--active-display', 'block');
    } else if (ul) {
      ul.style.setProperty('--active-display', 'none');
    }
    controller.value!.setAttribute('aria-activedescendant', state.active);
  });

  // Keydown

  useVisibleTask$(() => {
    // Prevent mousedown to trigger blur on the controller
    const onmousedown = (event: Event) => event.preventDefault();
    const onkeydown = (event: KeyboardEvent) => {
      if (preventKeys.includes(event.key)) event.preventDefault();
    }

    ref.value?.addEventListener('mousedown', onmousedown);
    controller.value?.addEventListener('keydown', onkeydown);
    return () => {
      ref.value?.removeEventListener('mousedown', onmousedown);
      controller.value?.removeEventListener('keydown', onkeydown);
    }
  });
  useOnElement(controller, 'keydown', $((event) => {
    const ul = ref.value!;
    const key = event.key;
    // Next
    if (key === 'ArrowDown' || key === 'ArrowRight') {
      const list = ul.querySelectorAll('li[role="option"]');
      const index = state.active
        ? Array.from(list).findIndex(li => li.id === state.active)
        : -1;
      const nextIndex = (index + 1) % list.length;
      state.active = list[nextIndex].id;
    }
    // Previous
    if (key === 'ArrowUp' || key === 'ArrowLeft') {
      const list = ul.querySelectorAll('li[role="option"]');
      const index = state.active
        ? Array.from(list).findIndex(li => li.id === state.active)
        : list.length;
      const nextIndex = (index - 1 + list.length) % list.length;
      state.active = list[nextIndex].id;
    }
    // Select
    if (key === 'Enter' || key === ' ') select(state.active);
  }));

  // 
  
  return <ul ref={ref} role="listbox" tabIndex={tabIndex} aria-multiselectable={state.multiple} {...props}>
    <Slot/>
  </ul>
});

interface OptionGroupProps {
  label: string;
  diabled?: boolean;
}
export const OptionGroup = component$(({ label }: OptionGroupProps) => {
  useStyles$(styles);
  return <li>
    <ul role="group">
      <h4>{label}</h4>
      <Slot/>
    </ul>
  </li>
})

interface OptionProps {
  value?: string | number | Date | boolean;
}
export const Option = component$((props: OptionProps) => {
  useStyles$(styles);
  const id = useId();
  const {state, select} = useContext(ListboxContext);
  const selected = useComputed$(() => state.selected.includes(id));
  return <li role="option"
    id={id}
    aria-selected={selected.value}
    data-value={props.value}
    onClick$={() => select(id)}
    onMouseEnter$={() => state.active = id}
  >
    <Slot/>
  </li>
})


// UTILS


export function moveActive(ul: HTMLElement, el: HTMLElement) {
  if (ul && el) {
    const origin = ul.getBoundingClientRect();
    const { width, height, top, left } = el.getBoundingClientRect();
    ul.style.setProperty('--active-width', `${width}px`);
    ul.style.setProperty('--active-height', `${height}px`);
    ul.style.setProperty('--active-left', `${Math.floor(left - origin.left)}px`);
    ul.style.setProperty('--active-top', `${Math.floor(top - origin.top)}px`);
    ul.style.setProperty('--active-display', 'block');
  } else if (ul) {
    ul.style.setProperty('--active-display', 'none');
  }
}

export function moveSelected(ul: HTMLElement, el: HTMLElement) {
  if (ul && el) {
    const origin = ul.getBoundingClientRect();
    const { width, height, top, left } = el.getBoundingClientRect();
    ul.style.setProperty('--selected-width', `${width}px`);
    ul.style.setProperty('--selected-height', `${height}px`);
    ul.style.setProperty('--selected-left', `${Math.floor(left - origin.left)}px`);
    ul.style.setProperty('--selected-top', `${Math.floor(top - origin.top)}px`);
    ul.style.setProperty('--selected-display', 'block');
  } else if (ul) {
    ul.style.setProperty('--selected-display', 'none');
  }
}

export const nextActive = $((root: HTMLElement, list?: NodeListOf<HTMLElement>) => {
  if (!list) return;
  const activeId = root.getAttribute('aria-activedescendant');
  const oldActive = activeId ? document.getElementById(activeId) : undefined;
  if (oldActive) oldActive.classList.remove('active');
  const index = oldActive
    ? Array.from(list).indexOf(oldActive)
    : 0;
  const nextIndex = (index + 1) % list.length;
  const active = list[nextIndex];
  root.setAttribute('aria-activedescendant', active.id);
  active.classList.add('active');
});

export const previousActive = $((root: HTMLElement, list?: NodeListOf<HTMLElement>) => {
  if (!list) return;
  const activeId = root.getAttribute('aria-activedescendant');
  const oldActive = activeId ? document.getElementById(activeId) : undefined;
  if (oldActive) oldActive.classList.remove('active');
  const index = oldActive
    ? Array.from(list).indexOf(oldActive)
    : list.length - 1;
  const nextIndex = (index - 1 + list.length) % list.length;
  const active = list[nextIndex];
  root.setAttribute('aria-activedescendant', list[nextIndex].id);
  active.classList.add('active');
});

/** Toggle selected option in a listbox with multiple */
export const toggleOption = $((controller: HTMLElement, activeId?: string | null) => {
  if (!activeId) activeId = controller.getAttribute('aria-activedescendant');
  if (!activeId) return;
  const active = document.getElementById(activeId);
  if (!active) return;
  if (active.getAttribute('aria-selected') === 'true') {
    active.setAttribute('aria-selected', 'false');
  } else {
    active.setAttribute('aria-selected', 'true');
  }
});

/** Select the option and remove the previous one */
export const selectOption = $((controller: HTMLElement, activeId?: string | null) => {
  if (!activeId) activeId = controller.getAttribute('aria-activedescendant');
  if (!activeId) return;
  const active = document.getElementById(activeId);
  if (!active) return;
  const selected = controller.querySelector('li[role="option"][aria-selected="true"]');
  if (selected) selected.setAttribute('aria-selected', 'false');
  active.setAttribute('aria-selected', 'true');
});
