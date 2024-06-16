import { $, component$, createContextId, event$, Slot, sync$, useContext, useContextProvider, useId, useStore, useStyles$, useTask$ } from "@builder.io/qwik";
import type { JSXChildren, JSXNode, JSXOutput, PropsOf, QRL} from "@builder.io/qwik";
import type { DivAttributes, ButtonAttributes } from "../types";
import { startViewTransition } from "../utils/transition";
import { FunctionComponent } from "@builder.io/qwik/jsx-runtime";
import { mergeProps } from "../utils/attributes";
import { disableTab, enableTab, focusList } from "../list/utils";
import styles from './tabs.scss?inline';

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

interface TabGroupProps extends PropsOf<'div'> {
  vertical?: boolean;
}

export const TabGroupImpl = component$((props: TabGroupProps) => {
  useStyles$(styles);
  const baseTransitionName = useId();
  const tabTransitionName = `tab-${baseTransitionName}`;
  const tabPanelTransitionName = `panel-${baseTransitionName}`;
  const state = useStore({
    active: '',
    leaving: '',
    tabTransitionName,
    tabPanelTransitionName
  });
  useContextProvider(TabsContext, state);
  const merged = mergeProps<'div'>(props, {
    class: ['tab-group', props.vertical ? 'vertical' : ''],
  });

  return <div {...merged}>
      <Slot/>
  </div>
});



export const TabListImpl = component$(() => {
  const preventKeyDown = sync$((e: KeyboardEvent) => {
    const keys = ['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft', 'Enter', ' ', 'Home', 'End'];
    if (keys.includes(e.key)) e.preventDefault();
  });
  const onKeyDown = $((e: KeyboardEvent, el: HTMLElement) => focusList('[role="tab"]', e, el));
  return <div
    class="tab-list"
    role="tablist"
    onKeyDown$={[preventKeyDown, onKeyDown]}
    onFocusIn$={(e, el) => disableTab(el, '[role="tab"]')}
    onFocusOut$={(e, el) => enableTab(el, '[role="tab"]', '[role="tab"][aria-selected="true"]')}
  >
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
    class={["tab-panel", props.class]}
    aria-labelledby={tabId}
    hidden={state.active !== tabId}
    {...attr}
  >
    <Slot/>
  </div>
});

export const Tab: FunctionComponent<PropsOf<'div'> & { label: JSXChildren, children: JSXOutput }> = (props) => {
  return props.children;
}


export const TabGroup: FunctionComponent<TabGroupProps> = ({ children, ...props }) => {
  const tabs: JSXChildren[] = [];
  const tabPanels = [];
  const tabProps: TabPanelProps[] = [];
  if (children instanceof Array) {
    for (const tab of children as JSXNode<typeof Tab>[]) {
      if (tab.type !== Tab) continue;
      const { label, ...rest } = tab.props;
      tabs.push(label);
      tabPanels.push(tab.children);
      tabProps.push({
        tabId: tab.key ?? crypto.randomUUID(),
        ...rest
      })
    }
  }
  return <TabGroupImpl {...props}>
    <TabListImpl>
      {tabs.map((tab, i) => <TabImpl id={tabProps[i].tabId} key={tabProps[i].tabId}>{tab}</TabImpl>)}
    </TabListImpl>
    <TabPanelListImpl>
      {tabPanels.map((panel, i) => <TabPanelImpl key={tabProps[i].tabId} {...tabProps[i]}>{panel}</TabPanelImpl>)}
    </TabPanelListImpl>
  </TabGroupImpl>

}