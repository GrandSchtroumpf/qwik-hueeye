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

const folder = join(cwd(), 'src/components/icons/material')

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

const cmptName = (name: string) => `Icon${toPascalCase(name)}`;

function svgSymbolComponent(name: string, text: string) {
  const svg = text
    .replace('width="24"', 'width="24" aria-hidden="true" fill="currentColor" {...props}');
  return `import { component$, IntrinsicSVGElements } from '@builder.io/qwik';
export const ${cmptName(name)} = component$<IntrinsicSVGElements['svg']>((props) => ${svg});
`;
}

async function writeOneSymbol(icon: Icon) {
  try {
    const text = await fetchSymbolText(icon);
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
  const promises = icons.map(icon => writeOneSymbol(icon));
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

/** Create file with all the static icons */
async function writeAllIconExport(names: string[]) {
  const baseImport = `import { component$ } from '@builder.io/qwik';
import { BaseMatIcon, SvgAttributes } from './icon';`
  const icons = names.map(name => `
import path_${name} from './material/${name}.txt?raw';
export const ${cmptName(name)} = component$<SvgAttributes>((props) => <BaseMatIcon d={path_${name}} {...props} />);
`).join('');
  const filename = join(folder, '../all-icons.tsx');
  return writeFile(filename, [baseImport, icons].join(''));
}

/** Create one file with all the icon path */
export async function writeIconPath() {
  if (!existsSync(folder)) await mkdir(folder, { recursive: true });
  const icons = await getSymbols();
  const names = icons.map(i => i.name);
  const promises = icons.map(async (icon) => {
    try {
      const text = await fetchSymbolText(icon);
      const svg = await parse(text);
      const [path] = svg.children;
      const filename = join(folder, `${icon.name}.txt`);
      return writeFile(filename, path.attributes.d);
    } catch (err) {
      console.error(`[Icon ${icon.name}] ${err}`)
    }
  });
  await Promise.all(promises);

  icons.map(i => i.name)
  const index = join(folder, 'index.ts');
  const imports = names.map(name => `'${name}': () => import('./${name}.txt?raw'),`).join('\n');
  await Promise.all([
    writeFile(index, `export default {\n${imports}\n};`),
    writeAllIconExport(names),
  ]);
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