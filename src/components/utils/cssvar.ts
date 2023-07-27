import type { Signal } from '@builder.io/qwik';
const toKebabCase = (str: string) => str.replace(/[A-Z]+(?![a-z])|[A-Z]/g, ($, ofs) => (ofs ? "-" : "") + $.toLowerCase())
const isSignal = (v: any): v is Signal => 'value' in v;
export function cssvar(variables: Record<string, any>) {
  let style = '';
  for (const [key, value] of Object.entries(variables)) {
    if (value === null || value === undefined) continue;
    if (isSignal(value)) {
      style += `--${toKebabCase(key)}: ${value.value};`
    } else {
      style += `--${toKebabCase(key)}: ${value};`
    }
  }
  if (!style) return {};
  return { style }
}