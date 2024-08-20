import { PropsOf, Slot, component$, useStyles$ } from "@builder.io/qwik";
import { mergeProps } from "../../utils/attributes";
import style from './field.scss?inline';

export const Field = component$<PropsOf<'div'>>((props) => {
  useStyles$(style);
  const attributes = mergeProps<'div'>(props, {
    class: 'he-field'
  });
  return <div {...attributes}>
    <Slot />
  </div>
});
