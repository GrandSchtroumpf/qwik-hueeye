import { component$, Slot, $ } from "@builder.io/qwik";
import type { JSXNode, JSXChildren, JSXOutput, QRL, PropsOf } from "@builder.io/qwik";
import { ControlProps, ControlListProps, extractControls, WithControl, WithControlList } from "../control";
import type { Serializable } from '../types';
import { Option } from "../option/option";
import { isJSXNode } from "../../utils/jsx";
import { BaseCombobox } from "./base";
import { BaseComboboxProps } from "./base";
import { ListController } from "../controller-list";
import { Controller } from "../controller";

export type ComboboxionItemProps = PropsOf<'li'> & {
  value?: string;
  mode?: 'radio' | 'toggle';
}


/** Get the text content of the option */
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

const displayNodeTextContent = (children: JSXChildren) => {
  const options = getOptions(children);
  return $((values?: Serializable) => {
    if (!Array.isArray(values)) return options[toKey(values)];
    if (!values?.length) return '';
    return values.map(value => options[toKey(value)]).join(', ');
  });
}

type Props<T extends Serializable> = PropsOf<'div'> & {
  children: JSXOutput[];
  display$?: QRL<(value: T) => string>;
  placeholder?: string
} & ((ControlListProps<T> & { multi: true; }) | ControlProps<T> & { multi?: false; });

export function Combobox<T extends Serializable>({ multi, children, display$, ...base }: Props<T>) {
  const selectChildren = children.filter(child => (isJSXNode(child) && child.type === Option));
  const display = display$ ?? displayNodeTextContent(selectChildren);
  if (multi) {
    return (
      <MultiComboboxImpl {...base as any} display$={display}>
        {selectChildren}
      </MultiComboboxImpl>
    );
  } else {
    return (
      <ComboboxImpl {...base as any} display$={display}>
        {children}
      </ComboboxImpl>
    ) 
  }
}


const MultiComboboxImpl = component$<WithControlList<Serializable, BaseComboboxProps>>((props) => {
  const { attr, controls } = extractControls(props);
  return (
    <ListController {...controls}>
      <BaseCombobox {...attr} multi={true}>
        <Slot />
      </BaseCombobox>
    </ListController>
  )
});

const ComboboxImpl = component$<WithControl<Serializable, BaseComboboxProps>>((props) => {
  const { attr, controls } = extractControls(props);
  return (
    <Controller {...controls}>
      <BaseCombobox {...attr} multi={false}>
        <Slot />
      </BaseCombobox>
    </Controller>
  )
});