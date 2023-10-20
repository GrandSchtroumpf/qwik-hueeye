import { Component, component$, IntrinsicSVGElements, SVGProps, useSignal, useTask$ } from '@builder.io/qwik';
import icons from './material/icon-record';

// type ExtractName<T> = T extends `mat_${infer I}` ? I : never;
type SvgAttributes = Omit<IntrinsicSVGElements['svg'], 'viewBox'>;
interface MatIconProps extends SvgAttributes {
  name: keyof typeof icons;
}


export const MatIcon = component$<MatIconProps>(({ name, ...props }) => {
  const d = useSignal<Component<SVGProps<SVGSVGElement>>>();
  useTask$(async () => {
    d.value = await icons[name].resolve();
  });
  if (d.value) return <d.value {...props}/>
  return <></>;
}); 