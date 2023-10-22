import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";
import { parse } from 'svgson';
import { cwd } from "process";

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

interface SymbolParams {
  fill?: boolean;
  weight?: 100 | 200 | 300 | 400 | 500;
}

const folder = join(cwd(), 'public/lib/icons/material');

const toPascalCase = (name: string) => {
  return name.split('_').map(x => x.charAt(0).toUpperCase() + x.slice(1).toLowerCase()).join('');
}
const toKebabCase = (name: string) => name.split('_').join('-');

const symbolMode = (params: SymbolParams) => {
  const defaultWeight = !params.weight || params.weight === 400;
  if (!params.fill && defaultWeight) return 'default';
  const weight = defaultWeight ? '' : `wght${params.weight}`;
  const fill = params.fill ? 'fill1' : '';
  return weight+fill;
}
const symbolUrl = (icon: Icon, params: SymbolParams) => {
  const mode = symbolMode(params);
  return `https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/${icon.name}/${mode}/24px.svg`;
}
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

async function fetchSymbolText(icon: Icon, params: SymbolParams) {
  const url = symbolUrl(icon, params);
  const res = await fetch(url);
  return res.text();
}

const cmptName = (name: string) => `Icon${toPascalCase(name)}`;

function svgSymbolComponent(name: string, text: string) {
  const svg = text
    .replace('width="24"', 'width="24" aria-hidden="true" fill="currentColor" {...props}');
  return `import { component$, IntrinsicSVGElements } from '@builder.io/qwik';
export const ${cmptName(name)} = component$<IntrinsicSVGElements['svg']>((props) => ${svg});
`;
}

async function writeOneSymbolComponent(icon: Icon) {
  try {
    const text = await fetchSymbolText(icon, {});
    const component = svgSymbolComponent(icon.name, text);
    const file = join(folder, `${icon.name}.tsx`);
    await writeFile(file, component);
    return icon.name;
  } catch(err) {
    throw new Error(`[SVG - ${icon.name}] ${err}`);
  }
}

async function writeSymbolRecord(names: string[]) {
  const imports = names.map(name => `import { ${cmptName(name)} } from './${name}';`).join('\n');
  const record = names.map(name => `'${name}': $(${cmptName(name)})`).join('\n');
  const file = `import { $ } from '@builder.io/qwik';
${imports}
export default {
  ${record}
};`;
  const filename = join(folder, 'icon-record.tsx');
  return writeFile(filename, file);
}

/** Create one file per icon */
export async function writeAllIcons() {
  if (!existsSync(folder)) await mkdir(folder, { recursive: true });
  // Get only material symbols, not icons
  const icons = await getSymbols();
  const promises = icons.map(icon => writeOneSymbolComponent(icon));
  const operations = await Promise.allSettled(promises);
  const names: string[] = [];
  for (const operation of operations) {
    if (operation.status === 'rejected') console.error(operation.reason);
    else names.push(operation.value);
  }
  const index = join(folder, 'index.ts');
  
  await Promise.all([
    writeSymbolRecord(names),
    writeFile(index, names.map(name => `export * from './${name}';`).join('\n')),
  ])
}


const allParams: SymbolParams[] = [
  {},
  { weight: 100 },
  { weight: 200 },
  { weight: 300 },
  { weight: 500 },
  { fill: true },
  { fill: true, weight: 100 },
  { fill: true, weight: 200 },
  { fill: true, weight: 300 },
  { fill: true, weight: 500 },
];

export async function writeOneSymbolJson(icon: Icon, paramsList: SymbolParams[]) {
  if (paramsList.length === 1) {
    const text = await fetchSymbolText(icon, paramsList[0]);
    const svg = await parse(text);
    const [path] = svg.children;
    const filename = join(folder, `${icon.name}.txt`);
    return writeFile(filename, path.attributes.d);
  } else {
    const record: Record<string, string> = {};
    const promises = paramsList.map(async params => {
      const text = await fetchSymbolText(icon, params);
      const svg = await parse(text);
      const [path] = svg.children;
      const mode = symbolMode(params);
      record[mode] = path.attributes.d;
    });
    await Promise.all(promises);
    const filename = join(folder, `${icon.name}.json`);
    return writeFile(filename, JSON.stringify(record));
  }
}

/** Create one file with all the icon path */
export async function writeIconPath(paramsList: SymbolParams[] = allParams) {
  if (!existsSync(folder)) await mkdir(folder, { recursive: true });
  const icons = await getSymbols();
  let cursor = 0;
  for (let i = 200; i < icons.length + 200; i += 200) {
    console.log(`Fetching ${cursor}-${i} icons with params ${JSON.stringify(paramsList)}`);
    const promises = icons.slice(cursor, i).map(async (icon) => {
      try {
        return writeOneSymbolJson(icon, paramsList)
      } catch (err) {
        console.error(`[Icon ${icon.name}] ${err}`)
      }
    });
    cursor = i;
    await Promise.all(promises);
  }

  // const types= icons.map(i => `"${i.name}"`).join(' | ');
  // console.log(`export type MatIconNames = ${types}`);
}


export interface IconMetadata {
  filename: string;
  name: string;
  version: number;
  categories: string[];
  tags: string[];
}
/** Create a file with all the icons metadata */
export async function writeIconList() {
  if (!existsSync(folder)) await mkdir(folder, { recursive: true });
  const symbols = await getSymbols();
  const result: IconMetadata[] = [];
  for (const icon of symbols) {
    const { name, version, tags } = icon;
    const categories = icon.categories.map(c => c.split('&')).flat();
    result.push({ name, version, categories, tags, filename: toKebabCase(name) });
  }
  const filename = join(folder, 'icons.json');
  await writeFile(filename, JSON.stringify(result));
}