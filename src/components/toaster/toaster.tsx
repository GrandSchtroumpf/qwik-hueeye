import { $, component$, createContextId, useContext, useContextProvider, useId, useSignal, useStyles$, useTask$ } from "@builder.io/qwik";
import type { JSXNode , QRL} from "@builder.io/qwik";
import type { UlAttributes } from "../types";
import { clsq, cssvar }  from '../utils';
import styles from './toaster.scss?inline';

export interface ToastProps {
  id: string;
  duration: number;
  position: 'start' | 'center' | 'end';
  content: string | QRL<(props: ToastProps) => JSXNode>;
  /**
   * Aria role: default 'status'.
   * @description The toast uses the html element output, which has implicit role 'status'
   * For information that requires an immediate attention of the user use 'alert'.
  */
  role: 'alert' | 'status';
  class?: string;
}
export type ToastParams = Partial<Omit<ToastProps, 'content'>>;
export type ToastNode = QRL<(props: ToastProps) => JSXNode>;

export const ToasterContext = createContextId<ToasterService>('ToasterContext');

type ToasterService = ReturnType<typeof useToasterProvider>;

export const useToasterProvider = () => {
  const toaster = useSignal<HTMLElement>();
  const toasts = useSignal<ToastProps[]>([]);
  const service = {
    toaster,
    toasts,
    add: $((content: ToastProps['content'], params: ToastParams = {}) => {
      params.id ||= crypto.randomUUID();
      params.duration ||= 1500;
      params.position ||= 'center';
      params.role ||= 'status';
      flip(toaster.value);
      toasts.value = toasts.value.concat({ content, ...params } as ToastProps);
    }),
    remove: $((id: string) => {
      const index = toasts.value.findIndex(t => t.id === id);
      toasts.value[index].duration = 0;
      toasts.value = [...toasts.value];
    }),
  }
  useContextProvider(ToasterContext, service);
  return service;
}

function flip(toaster?: HTMLElement) {
  if (!toaster) return;
  const previous: Record<string, number> = {};
  const list = toaster.querySelectorAll('li');
  for (const item of list) {
    previous[item.id] = item.getBoundingClientRect().top;
  }
  const animate = () => {
    const newList = toaster.querySelectorAll('li');
    if (newList.length === list.length) requestAnimationFrame(animate);
    for (const item of newList) {
      const delta = previous[item.id] - item.getBoundingClientRect().top;
      if (delta) {
        item.animate({ transform: [`translateY(${delta}px)`, `translateY(0)`] }, {
          duration: 150,
          easing: 'ease-out'
        });
      }
    }
  }
  requestAnimationFrame(animate)
}
 
export const useToaster = () => useContext(ToasterContext);


export const Toaster = component$((props: UlAttributes) => {
  useStyles$(styles);
  const { toaster, toasts } = useContext(ToasterContext);

  return <ul {...props} ref={toaster} class={clsq('toaster', props.class)}>
    {toasts.value.map((props) => <Toast key={props.id} {...props} />)}
  </ul>
});

export const Toast = component$((props: ToastProps) => {
  const { toaster, toasts } = useContext(ToasterContext);
  const { content, position, ...attributes } = props;
  const ref = useSignal<HTMLElement>();
  const itemId = useId();
  const leaving = useSignal(false);
  const toastPosition = position === 'center' ? position : `flex-${position}`;

  useTask$(({ track }) => {
    track(() => props.duration);
    const leave = () => {
      leaving.value = true;
      ref.value?.addEventListener('animationend', () => {
        flip(toaster.value);
        toasts.value = toasts.value.filter(t => t.id !== props.id);
      }, { once: true });
    };
    if (!props.duration) return leave();
    const timeout = setTimeout(leave, props.duration);
    return () => clearTimeout(timeout);
  })


  return <li ref={ref} id={itemId} class={leaving.value ? 'leave' : ''} {...cssvar({toastPosition})}>
    <output {...attributes} class={clsq('toast', props.class)}>
      {typeof content === 'string' ? content : content(props)}
    </output>
  </li>
});
