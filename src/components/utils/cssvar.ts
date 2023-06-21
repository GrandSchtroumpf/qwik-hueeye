const toKebabCase = (str: string) => str.replace(/[A-Z]+(?![a-z])|[A-Z]/g, ($, ofs) => (ofs ? "-" : "") + $.toLowerCase())
export function cssvar(variables: Record<string, any>) {
  let style = '';
  for (const [key, value] of Object.entries(variables)) {
    if (value === null || value === undefined) continue;
    style += `--${toKebabCase(key)}: ${value};`
  }
  if (!style) return {};
  return { style }
}