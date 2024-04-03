import { Slot, component$, useStyles$ } from "@builder.io/qwik";
import { BaseCheckList, BaseCheckListProps, BaseCheckItem, BaseCheckItemProps } from "./base";
import { mergeProps } from "../../utils/attributes";
import styles from './toggle.scss?inline';

export const ToggleList = component$<BaseCheckListProps>((props) => {
  useStyles$(styles);
  const merged = mergeProps<'div'>(props, { class: 'he-toggle-list' });
  return <BaseCheckList {...merged}>
    <Slot />
  </BaseCheckList>
});

export const ToggleItem = component$<BaseCheckItemProps>((props) => {
  useStyles$(styles);
  return <div class="he-toggle-item">
    <BaseCheckItem {...props}>
      <Slot/>
    </BaseCheckItem>
  </div>
});