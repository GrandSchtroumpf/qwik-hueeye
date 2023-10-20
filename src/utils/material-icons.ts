import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";
const listUrl = 'https://fonts.google.com/metadata/icons?key=material_symbols&incomplete=true';

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


function svgSymbolComponent(name: string, text: string) {
  const svg = text
    .replace('width="24"', 'width="24" aria-hidden="true" fill="currentColor" {...props}');
  return `import { component$, IntrinsicSVGElements } from '@builder.io/qwik';
export const Icon${toPascalCase(name)} = component$<IntrinsicSVGElements['svg']>((props) => ${svg});
`;
}

async function getOneSymbol(icon: Icon, folder: string) {
  try {
    const url = symbolUrl(icon);
    const res = await fetch(url);
    const text = await res.text();
    const filename = toKebabCase(icon.name);
    const component = svgSymbolComponent(icon.name, text);
    const file = join(folder, `${filename}.tsx`);
    await writeFile(file, component);
    return filename;
  } catch(err) {
    throw new Error(`[SVG - ${icon.name}] ${err}`);
  }
}


export async function getAllIcons(folder: string) {
  const res = await fetch(listUrl);
  const txt = await res.text();
  const metadata = JSON.parse(txt.slice(4)) as Metadata; // Remove leading )]}'
  if (!existsSync(folder)) await mkdir(folder, { recursive: true });
  // Get only material symbols, not icons
  const icons = metadata.icons.filter(icon => !icon.unsupported_families.includes('Material Symbols Outlined'));
  const promises = icons.map(icon => getOneSymbol(icon, folder));
  const operations = await Promise.allSettled(promises);
  const filenames: string[] = [];
  for (const operation of operations) {
    if (operation.status === 'rejected') console.error(operation.reason);
    else filenames.push(operation.value);
  }
  const index = join(folder, 'index.ts');
  await writeFile(index, filenames.map(name => `export * from './${name}';`).join('\n'));
}
