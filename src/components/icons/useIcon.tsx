import { useStore, $, useContextProvider, createContextId, useContext } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";

interface IconObserver {
  count: number;
  observer?: IntersectionObserver;
  listeners: Map<string, () => any>;
}

const iconObserver: IconObserver = {
  count: 0,
  listeners: new Map(),
};
const unobserve = $((target: Element) => {
  iconObserver.observer?.unobserve(target!);
  iconObserver.count--;
  if (iconObserver.count <= 0) {
    iconObserver.observer?.disconnect();
    iconObserver.listeners.delete(target.id);
    delete iconObserver.observer;
  }
});
const observe = $((target: Element, cb: () => void) => {
  if (!iconObserver.count || iconObserver.count <= 0) {
    iconObserver.count = 0;
    iconObserver.listeners = new Map();
    iconObserver.observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          iconObserver.listeners.get(entry.target.id)?.();
          unobserve(entry.target);
        }
      }
    }, { rootMargin: '200px' });
  }
  iconObserver.observer!.observe(target!);
  iconObserver.count++;
  iconObserver.listeners.set(target.id, cb);
});

type IconCtx = ReturnType<typeof useIconProvider>;
const IconContext = createContextId<IconCtx>('IconContext');


export type IconWeight = 
  | 100 | 200 | 300 | 400 | 500 | 600 | 700
  | '100' | '200' | '300' | '400' | '500' | '600' | '700';
interface SymbolParams {
  fill?: boolean;
  weight?: IconWeight;
}

export interface IconConfig {
  baseUrl?: string;
  defaultParams?: SymbolParams;
}

export const symbolMode = (params: SymbolParams) => {
  // Use == instead of === to support string value
  const defaultWeight = !params.weight || params.weight == '400';
  if (!params.fill && defaultWeight) return 'default';
  const weight = defaultWeight ? '' : `wght${params.weight}`;
  const fill = params.fill ? 'fill1' : '';
  return weight+fill;
}

export const useIconProvider = (config: IconConfig = {}) => {
  // TODO: get the absolute path to NPM
  const {
    baseUrl = 'https://raw.githubusercontent.com/GrandSchtroumpf/qwik-hueeye/icon/public/lib/icons/material',
    defaultParams = { fill: false, weight: 400 }
  } = config;
  const location = useLocation();
  const url = baseUrl.startsWith('http')
    ? baseUrl
    : `${location.url.origin}${baseUrl}`;
  const icons = useStore<Record<string, Record<string, string>>>({}, { deep: false });

  const get = $(async (name: string) => {
    if (icons[name]) return;
    try {
      const res = await fetch(`${url}/${name}.json`);
      const json = await res.json();
      return icons[name] = json;
    } catch(err) {
      console.error(err);
    }
  });

  const register = $((id: string, name: string) => {
    if (icons[name]) return () => null;
    const target = document.getElementById(id);
    if (!target) return () => null;
    observe(target, () => get(name));
    return () => unobserve(target);
  });
  const ctx = { icons, defaultParams, register, get };
  useContextProvider(IconContext, ctx);
  // TODO: remove after useContext is fixed in v2.0
  useContext(IconContext);
  return ctx;
}

export const useIcon = () => useContext(IconContext);