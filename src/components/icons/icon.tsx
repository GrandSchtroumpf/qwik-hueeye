import { component$, IntrinsicSVGElements, useSignal, useTask$, useVisibleTask$, useId } from '@builder.io/qwik';
import { isServer } from '@builder.io/qwik/build';
import icons from './material/index';

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
  name: keyof typeof icons;
  eager?: boolean;
}
/** Dynamic icon component */
export const MatIcon = component$<MatIconProps>(({ name, eager, ...props }) => {
  const d = useSignal('');
  const baseId = useId();
  const id = props.id ?? baseId;
  useTask$(async () => {
    if (isServer || eager) {
      const getIcon = icons[name] as (() => Promise<{ default: string }>);
      d.value = await getIcon().then(v => v.default);
    }
    // TODO: check how to access ref/id in useTask instead of useVisisbleTask$
  });
  useVisibleTask$(() => {
    if (d.value || eager) return;
    const observer = new IntersectionObserver(async ([entry]) => {
      if (entry.isIntersecting) {
        const getIcon = icons[name] as (() => Promise<{ default: string }>);
        d.value = await getIcon().then(v => v.default);
        observer.disconnect();
      }
    }, { rootMargin: '100px' });
    const el = document.getElementById(id);
    if (el) observer.observe(el);
    return () => observer.disconnect();
  })

  return <svg id={id} xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 -960 960 960"  {...props}>
    <path d={d.value}/>
  </svg>
});



// TODO: improve code by using only one IntersectionObserver
// const iconObserver: Partial<{ count: number, observer: IntersectionObserver }> = {};
// const unobserve = $((id: string) => {
//   console.log('Unobserver');
//   const target = document.getElementById(id);
//   iconObserver.observer?.unobserve(target!);
//   iconObserver.count!--;
//   if (iconObserver.count === 0) {
//     console.log('Disconnect');
//     iconObserver.observer?.disconnect();
//     delete iconObserver.observer;
//   }
// });
// const observe = $((id: string, cb: (id: string) => void) => {
//   if (!iconObserver.count) {
//     console.log('Create Observer');
//     iconObserver.count = 0;
//     iconObserver.observer = new IntersectionObserver((entries) => {
//       for (const entry of entries) {
//         if (entry.isIntersecting) {
//           console.log('Intersect');
//           cb(entry.target.id);
//           unobserve(entry.target.id);
//         }
//       }
//     }, { rootMargin: '100px' });
//   }
//   const target = document.getElementById(id);
//   iconObserver.observer!.observe(target!);
//   iconObserver.count++;
// });
