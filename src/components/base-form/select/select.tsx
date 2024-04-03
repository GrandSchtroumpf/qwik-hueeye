import { component$, Slot, useStyles$, $ } from "@builder.io/qwik";
import type { JSXNode, JSXChildren, JSXOutput, QRL, PropsOf } from "@builder.io/qwik";
import { ControlProps, useControlProvider, ControlListProps, useListControlProvider, extractControls } from "../control";
import type { Serializable } from '../types';
import { Option } from "../option/option";
import { isJSXNode } from "../../utils/jsx";
import { BaseSelect } from "./base";
import { BaseSelectImplProps } from "./base";
import styles from './select.scss?inline';

export type SelectionItemProps = PropsOf<'li'> & {
  value?: string;
  mode?: 'radio' | 'toggle';
}


/** Get the textcontent of the option */
const getNodeText = (node: JSXNode | string | number): string => {
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return node.toString();
  if (node instanceof Array) return node.map(getNodeText).join('');
  if (typeof node === 'object' && node) return getNodeText(node.props.children as any);
  return '';
}

const toKey = (value: Serializable) => value?.toString() ?? '';

/** Extract the options from the children of the select */
const getOptions = (node: JSXChildren) => {
  const options: Record<string, string> = {};
  if (node instanceof Array) {
    for (const child of node) Object.assign(options, getOptions(child));
  } else if (typeof node === 'object' && node) {
    if ('type' in node && node.type === Option && node.props.value) {
      options[toKey(node.props.value as any)] = getNodeText(node);
    }
    if ('props' in node && node.props.children === 'object' && node.props.children) {
      Object.assign(options, getOptions(node.props.children));
    }
  }
  return options;
}

const displayMultiNodeContent = (children: JSXChildren) => {
  const options = getOptions(children);
  return $((values: Serializable[]) => {
    if (!values.length) return;
    return values.map(value => options[toKey(value)]).join(', ');
  });
}

const displaySingleNodeContent = (children: JSXChildren) => {
  const options = getOptions(children);
  return $((value: Serializable) => {
    if (!value) return;
    return options[toKey(value)];
  });
}


interface OptionGroupProps {
  label: string;
  disabled?: boolean;
}
export const OptionGroup = component$(({ label }: OptionGroupProps) => {
  useStyles$(styles);
  return <li>
    <ul role="group">
      <h4>{label}</h4>
      <Slot/>
    </ul>
  </li>
})


type Props<T extends Serializable> = PropsOf<'div'> & {
  children: JSXOutput[];
  display$?: QRL<(value: T) => string>;
  placeholder?: string
} & ((ControlListProps<T> & { multi: true; }) | ControlProps<T> & { multi?: false; });

export function Select<T extends Serializable>({ multi, children, display$, ...base }: Props<T>) {
  if (multi) {
    const selectChildren = children.map(child => {
      if (isJSXNode(child) && child.type === Option) child.props['multi'] = true;
      return child;
    });
    const display = display$ ?? displayMultiNodeContent(selectChildren);
    return (
      <MultiSelectImpl {...base as MultiSelectProps<T>} display$={display as any}>
        {selectChildren}
      </MultiSelectImpl>
    );
  } else {
    const display = display$ ?? displaySingleNodeContent(children);
    return (
      <SelectImpl {...base as SelectProps<T>} display$={display as any}>
        {children}
      </SelectImpl>
    ) 
  }
}


interface MultiSelectProps<T extends Serializable = Serializable> extends ControlListProps<T>, BaseSelectImplProps<T> {}
const MultiSelectImpl = component$<MultiSelectProps>((props) => {
  const { controls } = extractControls(props);
  const { list } = useListControlProvider(controls);
  return <BaseSelect {...props} multi={true} currentValue={list}>
    <Slot />
  </BaseSelect>
});

interface SelectProps<T extends Serializable = Serializable> extends ControlProps<T>, BaseSelectImplProps<T> {}
const SelectImpl = component$<SelectProps>((props: SelectProps) => {
  const { controls } = extractControls(props);
  const { control } = useControlProvider(controls);
  return <BaseSelect {...props} multi={false} currentValue={control}>
    <Slot />
  </BaseSelect>
});