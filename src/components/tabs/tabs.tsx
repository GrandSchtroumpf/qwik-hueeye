import { component$, createContextId, event$, Slot, useComputed$, useContext, useContextProvider, useSignal, useStore, useStyles$, useTask$, useVisibleTask$ } from "@builder.io/qwik";
import type { JSXNode, QRL, QwikKeyboardEvent} from "@builder.io/qwik";
import type { DivAttributes, ButtonAttributes } from "../types";
import { nextFocus, previousFocus, relativePosition } from "../utils";
import styles from './tabs.scss?inline';

export type TabLabel = string | QRL<((id: string, i: number) => JSXNode)>;

interface TabsContextState {
  active: string;
  leaving: string;
}

const TabsContext = createContextId<TabsContextState>('TabsContext');

export const TabGroup = component$((props: DivAttributes) => {
  useStyles$(styles);
  const ref = useSignal<HTMLElement>();
  const state = useStore<TabsContextState>({ active: '', leaving: '' });
  useContextProvider(TabsContext, state);

  useVisibleTask$(({ track }) => {
    track(() => state.leaving);
    const el = document.getElementById(`panel-${state.leaving}`);
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        state.leaving = '';
        obs.disconnect();
      }
    }, { threshold: 1 });
    obs.observe(el);
    el.scrollIntoView();
  });

  useVisibleTask$(({ track }) => {
    track(() => state.active);

    const panel = document.getElementById(`panel-${state.active}`);
    panel?.scrollIntoView({ behavior: 'smooth' });

    function move() {
      const tab = document.getElementById(state.active);
      if (!ref.value || !tab) return requestAnimationFrame(move);
      const target = tab.getBoundingClientRect();
      const origin = ref.value!.getBoundingClientRect();
      const { x, y } = relativePosition(origin, target);
      ref.value.style.setProperty('--active-x', `${x}px`);
      ref.value.style.setProperty('--active-y', `${y}px`);
      ref.value.style.setProperty('--active-width', `${target.width}px`);
      ref.value.style.setProperty('--active-height', `${target.height}px`);
    }
    move();
  });

  return <div class="tab-group" ref={ref} {...props}>
      <Slot/>
  </div>
});



export const TabList = component$(() => {
  const ref = useSignal<HTMLElement>();
  const onKeydown$ = event$((event: QwikKeyboardEvent) => {
    const key = event.key;
    if (key === 'ArrowDown' || key === 'ArrowRight') {
      nextFocus(ref.value?.querySelectorAll<HTMLElement>('[role="tab"]'));
    }
    if (key === 'ArrowUp' || key === 'ArrowLeft') {
      previousFocus(ref.value?.querySelectorAll<HTMLElement>('[role="tab"]'));
    }
    if (key === ' ' || key === 'Enter') (document.activeElement as HTMLElement).click();
  });

  return <div ref={ref} class="tab-list" role="tablist" onKeydown$={onKeydown$}>
    <Slot/>
  </div>
});

interface TabProps extends ButtonAttributes {
  id: string;
}

export const Tab = component$((props: TabProps) => {
  const state = useContext(TabsContext);
  const { id, ...attr } = props;

  const activate = event$(() => {
    if (id === state.active) return;
    state.leaving = state.active;
    state.active = id;
  });

  return <button id={id} 
    role="tab" 
    class="tab"
    type="button"
    tabIndex={state.active === id ? 0 : -1}
    aria-controls={`panel-${id}`}
    aria-selected={state.active === id}
    onClick$={activate}
    {...attr}
  >
    <Slot/>
  </button>
})

export const TabPanelList = component$(() => {
  return <div class="tab-panel-container">
    <Slot/>
  </div>
})

interface TabPanelProps extends DivAttributes {
  tabId: string;
}

export const TabPanel = component$((props: TabPanelProps) => {
  const state = useContext(TabsContext);
  const { tabId, ...attr } = props;
  useTask$(() => {
    if (!state.active) state.active = tabId;
  });

  const classes = useComputed$(() => {
    const list = ['tab-panel'];
    if (state.leaving === tabId) list.push('leave');
    if (state.active !== tabId) list.push('hidden');
    return list;
  });

  return <div id={`panel-${tabId}`}
    role="tabpanel"
    class={classes}
    aria-labelledby={tabId}
    tabIndex={state.active === tabId ? 0 : -1}
    {...attr}
  >
    <Slot/>
  </div>
});
