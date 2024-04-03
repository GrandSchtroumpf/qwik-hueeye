import { IntrinsicElements, PropsOf } from "@builder.io/qwik";
import { clsq } from "./clsq";

export function mergeProps<T extends keyof IntrinsicElements>(
  ...list: PropsOf<T>[]
) {
  const attributes: Record<string, any> = {};
  for (const item of list) {
    for (const [key, value] of Object.entries(item)) {
      if (['class', 'style'].includes(key)) {
        attributes[key] ||= [];
        attributes[key].push(value);
      } else if (key.startsWith('on') && typeof value === 'function') {
        attributes[key] ||= [];
        attributes[key] = value; // TODO: use $(value) to wrap the function
      } else {
        attributes[key] = value;
      }
    }
  }
  if ('class' in  attributes) attributes['class'] = clsq(...attributes['class']);
  if ('style' in attributes) attributes['style'] = attributes['style'].join(';');
  return attributes as PropsOf<T>;
}
