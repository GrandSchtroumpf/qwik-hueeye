import { Component, JSXChildren, JSXNode } from "@builder.io/qwik";

export const isJSXNode = (child: JSXChildren): child is JSXNode => {
  return !!child && typeof child === 'object' && 'type' in child;
}
export const isNodeType = <Type extends Component<any>>(type: Type) => (child: JSXChildren): child is JSXNode<Type> => {
  return isJSXNode(child) && child.type === type;
}

export const findNode = <Type extends Component<any>>(children: JSXChildren, type: Type) => {
  const list = Array.isArray(children) ? children : [children];
  const filter = isNodeType(type);
  return list.find(filter);
}