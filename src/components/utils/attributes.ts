import { IntrinsicElements, PropsOf } from "@builder.io/qwik";
import { clsq } from "./clsq";

const toKebabCase = (str: string) => str.replace(/[A-Z]+(?![a-z])|[A-Z]/g, ($, ofs) => (ofs ? "-" : "") + $.toLowerCase())
export function mergeProps<T extends keyof IntrinsicElements>(
  ...list: PropsOf<T>[]
) {
  const attributes: Record<string, any> = {};
  for (const item of list) {
    for (const [key, value] of Object.entries(item)) {
      if (['class', 'style'].includes(key)) {
        attributes[key] ||= [];
        attributes[key].push(value);
      } else if (key.startsWith('on') && key.endsWith('$')) {
        attributes[key] ||= [];
        if (Array.isArray(value)) attributes[key].push(...value);
        else attributes[key].push(value);
      } else {
        attributes[key] = value;
      }
    }
  }
  if ('class' in  attributes) {
    attributes['class'] = clsq(...attributes['class']);
  }
  if ('style' in attributes) {
    const styles = [];
    for (const style of attributes['style']) {
      if (typeof style === 'string') {
        styles.push(style);
      } else if (Array.isArray(style)) {
        // TODO: recursive fn
      } else if (typeof style === 'object') {
        for (const [key, value] of Object.entries(style)) {
          styles.push(`${toKebabCase(key)}: ${value}`);
        }
      }
    }
    attributes['style'] = styles.join(';');
  }
  return attributes as PropsOf<T>;
}
