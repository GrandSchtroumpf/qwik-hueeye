import { $, JSXNode } from "@builder.io/qwik";

export const focusInInputList = $((e: Event, el: HTMLElement) => {
  const active = document.activeElement;
  const inputs = el.querySelectorAll('input');
  for (let i = 0; i < inputs.length; i++) {
    if (active !== inputs[i]) inputs[i].setAttribute('tabindex', '-1');
  }
});
export const focusOutInputList = $((e: Event, el: HTMLElement) => {
  const input = el.querySelector('input:checked') ?? el.querySelector('input');
  input?.setAttribute('tabindex', '0');
});

/** Get the text content of the option */
export const getNodeText = (node: JSXNode | string | number): string => {
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return node.toString();
  if (node instanceof Array) return node.map(getNodeText).join('');
  if (typeof node === 'object' && node) return getNodeText(node.props.children as any);
  return '';
}
