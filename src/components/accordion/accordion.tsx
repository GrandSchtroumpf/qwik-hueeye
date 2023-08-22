import { $, component$, createContextId, Slot, useComputed$, useContext, useContextProvider, useId, useSignal, useStore, useStyles$, useTask$ } from "@builder.io/qwik";
import { isBrowser } from '@builder.io/qwik/build';
import { nextFocus, previousFocus, useKeyboard } from "../utils";
import type { Signal, QRL } from '@builder.io/qwik';
import type { UlAttributes } from "../types";
import styles from './accordion.scss?inline';

const AccordionContext = createContextId<AccordionService>('AccordionContext');
const DetailsContext = createContextId<DetailsService>('DetailsContext');

interface AccordionState {
  opened: string[];
  multiple: boolean;
}
interface AccordionService {
  state: AccordionState;
  next: QRL<() => any>;
  previous: QRL<() => any>;
  openAll: QRL<() => void >;
  closeAll: QRL<() => void >;
  toggle: QRL<(id: string) => void >;
}
interface DetailsService {
  id: string;
  opened: Signal<boolean>;
}

const flip = $((ids: string[], root: HTMLUListElement) => {
  const state = new Map<string, DOMRect>();
  const list = root.querySelectorAll<HTMLElement>('li.details');
  const openingPanels: HTMLElement[] = [];

  state.set('root', root.getBoundingClientRect());

  for (const item of list) {
    state.set(item.id, item.getBoundingClientRect());
    // Opening
    if (!item.classList.contains('open') && ids.includes(item.id)) {
      const panel = document.getElementById(`panel-${item.id}`);
      if (!panel) throw new Error(`No panel found for accordion details with id "${item.id}"`);
      openingPanels.push(panel);
    }
  }
  // update after getting the state
  for (const item of list) {
    ids.includes(item.id) ? item.classList.add('open') : item.classList.remove('open');
  }

  requestAnimationFrame(() => {
    // Root: change height only when it gets smaller to avoir shrinking content
    const { height } = root.getBoundingClientRect();
    const oldHeight = state.get('root')!.height;
    if (oldHeight > height) {
      root.animate({ height: [`${oldHeight}px`, `${height}px`] }, {
        duration: 200,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
      })
    }
    // Translate item 
    for (const item of list) {
      const box = item.getBoundingClientRect();
      const oldState = state.get(item.id)!;
      if (oldState.top !== box.top) {
        const delta = oldState.top - box.top;
        item.animate({ transform: [`translateY(${delta}px)`, `none`] }, {
          duration: 200,
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
        });
      }
    }
    // Scale then make visible
    for (const panel of openingPanels) {
      panel.animate({ transform: ['scaleY(0)', 'scaleY(1)'] }, {
        duration: 200,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
      });
      const content = panel.querySelector('.details-panel-content')!;
      content.animate([
        { opacity: 0 },
        { opacity: 0, transform: 'scale(0.995)' },
        { opacity: 1 },
      ], {
        duration: 400,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
      })
    }
  })
})


export interface AccordionProps extends UlAttributes {
  multiple?: boolean;
}



export const Accordion = component$((props: AccordionProps) => {
  useStyles$(styles);
  const { multiple, ...ulProps } = props;
  const ref = useSignal<HTMLUListElement>();
  const state = useStore<AccordionState>({
    opened: [],
    multiple: multiple ?? false,
  });
  useTask$(({ track }) => {
    track(() => state.opened);
    if (isBrowser) flip(state.opened, ref.value!);
  });
  useContextProvider(AccordionContext, {
    state,
    next: $(() => nextFocus(ref.value?.querySelectorAll<HTMLElement>('button.details-controller'))),
    previous: $(() => previousFocus(ref.value?.querySelectorAll<HTMLElement>('button.details-controller'))),
    openAll: $(() => {
      const list = ref.value!.querySelectorAll('li.details')!;
      state.opened = Array.from(list).map(item => item.id);
    }),
    closeAll: $(() => state.opened = []),
    toggle: $((id: string) => {
      const isOpen = state.opened.includes(id);
      if (state.multiple) {
        if (isOpen) {
          state.opened = state.opened.filter(panelId => panelId !== id);
        } else {
          state.opened = state.opened.concat(id);
        }
      } else {
        state.opened = isOpen ? [] : [id];
      }
    })
  });
  return <ul class="accordion" {...ulProps} ref={ref}>
    <Slot/>
  </ul>
});



export const Details = component$(() => {
  const id = useId();
  const { state } = useContext(AccordionContext);
  const opened = useComputed$(() => state.opened.includes(id));
  
  useContextProvider(DetailsContext, { id, opened });
  return <li id={id} class="details">
    <Slot/>
  </li>
});

const preventKeys = ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Enter', ' '];

export const Summary = component$(() => {
  const { next, previous, toggle } = useContext(AccordionContext);
  const { id, opened } = useContext(DetailsContext);
  const ref = useSignal<HTMLElement>();
  const panelId = `panel-${id}`;
  useKeyboard(ref, preventKeys, $((event) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next();
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') previous();
    if (event.key === 'Enter' || event.key === ' ') toggle(id);
  }));
  return <button ref={ref} type="button"
    class="details-controller"
    aria-expanded={opened.value}
    aria-controls={panelId}
    onClick$={() => toggle(id)}
  >
    <Slot/>
  </button>
});

export const DetailsPanel = component$(() => {
  const ref = useSignal<HTMLElement>();
  const { id } = useContext(DetailsContext);
  const panelId = `panel-${id}`;
  return <div ref={ref} id={panelId} role="region" class="details-panel">
    <div class="details-panel-content">
      <Slot/>
    </div>
  </div>
});