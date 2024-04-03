import { JSXChildren, Slot, component$, useStyles$ } from "@builder.io/qwik";
import { BaseCheckAll, BaseCheckItem, BaseCheckList, BaseCheckbox, BaseCheckItemProps, BaseCheckboxProps, BaseCheckListProps } from "./base";
import { mergeProps } from "../../utils/attributes";
import { InputAttributes } from "../types";
import { isNodeType } from "../../utils/jsx";
import styles from './checkbox.scss?inline';

export const CheckSymbol = () => (
  <svg  focusable="false" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="none"></path>
  </svg>
);

type CheckListProps = BaseCheckListProps & {
  children: JSXChildren;
}
export function CheckList(props: CheckListProps) {
  const { children, ...rest } = props;
  const childrenArray = Array.isArray(children) ? children : [children];
  const merged = mergeProps<'div'>(rest, { class: 'he-check-list' });
  const allValues = childrenArray.filter(isNodeType(CheckItem)).map(node => node.props.value);
  return <BaseCheckList {...merged} allValues={allValues}>
    {children}
  </BaseCheckList>
}

export const CheckAll = component$<InputAttributes>((props) => {
  useStyles$(styles);
  return <div class="he-check-all">
    <BaseCheckAll {...props} intermediateClass="he-check-indeterminate">
      <CheckSymbol />
      <Slot/>
    </BaseCheckAll>
  </div>
});

export const CheckItem = component$<BaseCheckItemProps>((props) => {
  useStyles$(styles);
  return <div class="he-check-item">
    <BaseCheckItem {...props}>
      <CheckSymbol />
      <Slot/>
    </BaseCheckItem>
  </div>
});

export const Checkbox = component$<BaseCheckboxProps>((props) => {
  useStyles$(styles);
  return <div class="he-checkbox">
    <BaseCheckbox {...props}>
      <CheckSymbol />
      <Slot/>
    </BaseCheckbox>
  </div>
});