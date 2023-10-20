import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";
import { parse } from 'svgson';

interface Metadata {
  host: string;
  asset_url_pattern: string;
  icons: Icon[];
}

interface Icon {
  name: string;
  version: number;
  popularity: number;
  codepoint: number;
  unsupported_families: string[];
  categories: string[];
  tags: string[];
  sizes_px: number[];
}

const toPascalCase = (name: string) => {
  return name.split('_').map(x => x.charAt(0).toUpperCase() + x.slice(1).toLowerCase()).join('');
}
const toKebabCase = (name: string) => name.split('_').join('-');
const symbolUrl = (icon: Icon) => `https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/${icon.name}/default/24px.svg`
// const iconUrl = (icon: Icon) => `https://fonts.gstatic.com/s/i/materialiconsoutlined/${icon.name}/v${icon.version}/24px.svg`


async function getMetadata() {
  const res = await fetch('https://fonts.google.com/metadata/icons?key=material_symbols&incomplete=true');
  const txt = await res.text();
  return JSON.parse(txt.slice(4)) as Metadata; // Remove leading )]}'
}

async function getSymbols() {
  const metadata = await getMetadata();
  return metadata.icons.filter(icon => !icon.unsupported_families.includes('Material Symbols Outlined'));
}

async function fetchSymbolText(icon: Icon) {
  const url = symbolUrl(icon);
  const res = await fetch(url);
  return res.text();
}

function svgSymbolComponent(name: string, text: string) {
  const svg = text
    .replace('width="24"', 'width="24" aria-hidden="true" fill="currentColor" {...props}');
  return `import { component$, IntrinsicSVGElements } from '@builder.io/qwik';
export const Icon${toPascalCase(name)} = component$<IntrinsicSVGElements['svg']>((props) => ${svg});
`;
}

async function writeOneSymbol(icon: Icon, folder: string) {
  try {
    const text = await fetchSymbolText(icon);
    const filename = toKebabCase(icon.name);
    const component = svgSymbolComponent(icon.name, text);
    const file = join(folder, `${filename}.tsx`);
    await writeFile(file, component);
    return filename;
  } catch(err) {
    throw new Error(`[SVG - ${icon.name}] ${err}`);
  }
}

/** Create one file per icon */
export async function writeAllIcons(folder: string) {
  if (!existsSync(folder)) await mkdir(folder, { recursive: true });
  // Get only material symbols, not icons
  const icons = await getSymbols();
  const promises = icons.map(icon => writeOneSymbol(icon, folder));
  const operations = await Promise.allSettled(promises);
  const filenames: string[] = [];
  for (const operation of operations) {
    if (operation.status === 'rejected') console.error(operation.reason);
    else filenames.push(operation.value);
  }
  const index = join(folder, 'index.ts');
  await writeFile(index, filenames.map(name => `export * from './${name}';`).join('\n'));
}



/** Create one file with all the icon path */
export async function writeIconPath(folder: string) {
  const icons = await getSymbols();
  const record: Record<string, string> = {};
  const promises = icons.map(async (icon) => {
    const text = await fetchSymbolText(icon);
    const svg = await parse(text);
    const [path] = svg.children;
    record[icon.name] = path.attributes.d;
  });
  await Promise.all(promises);
  const filename = join(folder, 'material.ts');
  const file = `export default ${JSON.stringify(record)};`;
  await writeFile(filename, file);
}


export interface IconMetadata {
  filename: string;
  name: string;
  version: number;
  categories: string[];
  tags: string[];
}
/** Create a file with all the icons metadata */
export async function writeIconList(folder: string) {
  const symbols = await getSymbols();
  const result: IconMetadata[] = [];
  for (const icon of symbols) {
    const { name, version, tags } = icon;
    const categories = icon.categories.map(c => c.split('&')).flat();
    result.push({ name, version, categories, tags, filename: toKebabCase(name) });
  }
  if (!existsSync(folder)) await mkdir(folder, { recursive: true });
  const filename = join(folder, 'icons.json');
  await writeFile(filename, JSON.stringify(result));
}