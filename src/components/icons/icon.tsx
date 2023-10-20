import { component$, IntrinsicSVGElements } from '@builder.io/qwik';
import materialIcons from './material';

type SvgAttributes = Omit<IntrinsicSVGElements['svg'], 'viewBox'>;
interface MatIconProps extends SvgAttributes {
  name: keyof typeof materialIcons;
}

export const MatIcon = component$<MatIconProps>(({ name, ...props }) => {
  return <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 -960 960 960"  {...props}>
    <path d={materialIcons[name]}/>
  </svg>
});