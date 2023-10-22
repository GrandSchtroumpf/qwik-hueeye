import { component$, IntrinsicSVGElements, useTask$, useVisibleTask$, useId, useComputed$, useStylesScoped$ } from '@builder.io/qwik';
import { isServer } from '@builder.io/qwik/build';
import { IconWeight, symbolMode, useIcon } from './useIcon';
import type { MatIconNames } from './material.type';

export type SvgAttributes = Omit<IntrinsicSVGElements['svg'], 'viewBox'>;

interface BaseMatIconProps extends SvgAttributes {
  d: string;
}
/** Base component for static icons */
export const BaseMatIcon = component$<BaseMatIconProps>(({ d, ...props }) => {
  return <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 -960 960 960"  {...props}>
    <path d={d}/>
  </svg>
})

interface MatIconProps extends SvgAttributes {
  name: MatIconNames;
  filled?: boolean;
  weight?: IconWeight;
  eager?: boolean;
}

/** Dynamic icon component */
export const MatIcon = component$<MatIconProps>(({ name, filled, weight, eager, ...props }) => {
  useStylesScoped$('path { transition: d 3s; }');
  const ctx = useIcon();
  const baseId = useId();
  const id = props.id ?? baseId;
  useTask$(async () => {
    if (isServer || eager) await ctx.get(name);
  });
  useVisibleTask$(async () => {
    if (eager) return;
    const disconnect = await ctx.register(id, name);
    return () => disconnect();
  });
  const d = useComputed$(() => {
    const mode = symbolMode({
      fill: filled ?? ctx.defaultParams.fill,
      weight: weight ?? ctx.defaultParams.weight,
    });
    return ctx.icons[name]?.[mode] ?? ''
  })

  return <svg id={id} xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 -960 960 960" fill="currentColor" {...props}>
    <path d={d.value} />
  </svg>
});
