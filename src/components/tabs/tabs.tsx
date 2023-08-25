import { $, component$, createContextId, event$, Slot, useContext, useContextProvider, useId, useSignal, useStore, useStyles$, useTask$ } from "@builder.io/qwik";
import type { JSXChildren, JSXNode, QRL} from "@builder.io/qwik";
import type { DivAttributes, ButtonAttributes } from "../types";
import { ArrowsKeys, ControlKeys, cssvar, nextFocus, previousFocus } from "../utils";
import styles from './tabs.scss?inline';
import { useKeyboard } from "../utils/keyboard";
import { startViewTransition } from "../utils/transition";
import { FunctionComponent } from "@builder.io/qwik/jsx-runtime";

export type TabLabel = string | QRL<((id: string, i: number) => JSXNode)>;

interface TabsContextState {
  active: string;
  leaving: string;
  noAnimation: boolean;
  tabTransitionName: string;
  tabPanelTransitionName: string;
}

const animateTab = $((state: TabsContextState, dir: 1 | -1) => {
  document.documentElement.animate({
    height: ['100%', '100%']
  },{
    duration: 275,
    pseudoElement: `::view-transition-old(${state.tabTransitionName})`,
  });
  document.documentElement.animate({
    height: ['100%', '100%']
  },{
    duration: 275,
    pseudoElement: `::view-transition-new(${state.tabTransitionName})`,
  });


  document.documentElement.animate({
    overflow: ['hidden', 'hidden']
  },{
    duration: 275,
    pseudoElement: `::view-transition-group(${state.tabPanelTransitionName})`,
  });
  document.documentElement.animate({
    transform: ['translateX(0)', `translateX(${100 * dir}%)`]
  },{
    duration: 275,
    pseudoElement: `::view-transition-old(${state.tabPanelTransitionName})`,
  });
  document.documentElement.animate({
    transform: [`translateX(${-100 * dir}%)`, 'translateX(0)']
  },{
    duration: 275,
    pseudoElement: `::view-transition-new(${state.tabPanelTransitionName})`,
  });
})

const TabsContext = createContextId<TabsContextState>('TabsContext');

interface TabGroupImplProps extends DivAttributes {
  noAnimation?: boolean
}

export const TabGroupImpl = component$((props: TabGroupImplProps) => {
  useStyles$(styles);
  const ref = useSignal<HTMLElement>();
  const baseTransitionName = useId();
  const tabTransitionName = `tab-${baseTransitionName}`;
  const tabPanelTransitionName = `panel-${baseTransitionName}`;
  const state = useStore({
    active: '',
    leaving: '',
    noAnimation: props.noAnimation,
    tabTransitionName,
    tabPanelTransitionName
  });
  useContextProvider(TabsContext, state);

  const {style} = state.noAnimation
    ? { style: '' }
    : cssvar({tabTransitionName, tabPanelTransitionName});
  return <div class="tab-group" ref={ref} style={style} {...props}>
      <Slot/>
  </div>
});



export const TabListImpl = component$(() => {
  const ref = useSignal<HTMLElement>();
  useKeyboard(ref, [...ArrowsKeys, ...ControlKeys], $((event) => {
    const key = event.key;
    if (key === 'ArrowDown' || key === 'ArrowRight') {
      nextFocus(ref.value?.querySelectorAll<HTMLElement>('[role="tab"]'));
    }
    if (key === 'ArrowUp' || key === 'ArrowLeft') {
      previousFocus(ref.value?.querySelectorAll<HTMLElement>('[role="tab"]'));
    }
    if (key === ' ' || key === 'Enter') (document.activeElement as HTMLElement).click();
  }));

  return <div ref={ref} class="tab-list" role="tablist">
    <Slot/>
  </div>
});

interface TabProps extends ButtonAttributes {
  id: string;
}

export const TabImpl = component$((props: TabProps) => {
  const state = useContext(TabsContext);
  const { id, ...attr } = props;
  useTask$(() => {
    if (!state.active) state.active = id;
  });

  const activate = event$(() => {
    if (id === state.active) return;
    if (state.noAnimation || !('startViewTransition' in document)) {
      state.leaving = state.active;
      state.active = id;
    } else {
      const transition = startViewTransition(async () => {
        state.leaving = state.active;
        state.active = id;
      });
      const [oldPanel, newPanel] = [
        document.getElementById(`panel-${state.active}`)!,
        document.getElementById(`panel-${id}`)!,
      ];
      const dir = oldPanel?.compareDocumentPosition(newPanel) === Node.DOCUMENT_POSITION_FOLLOWING
        ? -1
        : 1;
      if (!transition) return;
      transition.ready.then(() => animateTab(state, dir));
    }
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

export const TabPanelListImpl = component$(() => {
  return <div class="tab-panel-container">
    <Slot/>
  </div>
})

interface TabPanelProps extends DivAttributes {
  tabId: string;
}

export const TabPanelImpl = component$((props: TabPanelProps) => {
  const state = useContext(TabsContext);
  const { tabId, ...attr } = props;

  return <div id={`panel-${tabId}`}
    role="tabpanel"
    class="tab-panel"
    aria-labelledby={tabId}
    tabIndex={state.active === tabId ? 0 : -1}
    hidden={state.active !== tabId}
    {...attr}
  >
    <Slot/>
  </div>
});

export const Tab: FunctionComponent<{label: JSXChildren, children: any}> = (props) => {
  return props.children;
}


export const TabGroup: FunctionComponent<TabGroupImplProps> = ({ children, ...props }) => {
  const tabIds: string[] = [];
  const tabs = [];
  const tabPanels = [];
  if (children instanceof Array) {
    for (const tab of children as JSXNode[]) {
      if (tab.type !== Tab) continue;
      tabIds.push(tab.key ?? crypto.randomUUID());
      tabs.push(tab.props.label)
      tabPanels.push(tab.children);
    }
  }
  return <TabGroupImpl {...props}>
    <TabListImpl>
      {tabs.map((tab, i) => <TabImpl id={tabIds[i]} key={tabIds[i]}>{tab}</TabImpl>)}
    </TabListImpl>
    <TabPanelListImpl>
      {tabPanels.map((panel, i) => <TabPanelImpl tabId={tabIds[i]} key={tabIds[i]}>{panel}</TabPanelImpl>)}
    </TabPanelListImpl>
  </TabGroupImpl>

}