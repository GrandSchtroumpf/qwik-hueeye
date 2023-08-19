import { QwikIntrinsicElements } from "@builder.io/qwik";
import { clsq } from "./clsq";

export function mergeProps<T extends keyof QwikIntrinsicElements>(
  ...list: QwikIntrinsicElements[T][]
) {
  const attributes: Record<string, any> = {};
  for (const item of list) {
    for (const [key, value] of Object.entries(item)) {
      if (key.startsWith('on') || key === 'class' || key === 'style') {
        attributes[key] ||= [];
        attributes[key].push(value);
      } else {
        attributes[key] = value;
      }
    }
  }
  if ('class' in  attributes) attributes['class'] = clsq(...attributes['class']);
  if ('style' in attributes) attributes['style'] = attributes['style'].join(';');
  return attributes as QwikIntrinsicElements[T];
}
