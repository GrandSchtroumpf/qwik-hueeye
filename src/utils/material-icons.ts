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
}

const toPascalCase = (name: string) => {
  return name.split('_').map(x => x.charAt(0).toUpperCase() + x.slice(1).toLowerCase()).join('');
}
const toKebabCase = (name: string) => name.split('_').join('-');
const iconUrl = (name: string) => `https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/${name}/default/24px.svg`

function svgComponent(name: string, text: string) {
  const svg = text.replace('width="24"', 'width="24" aria-hidden="true" fill="currentColor" {...props}');
  return `import { component$, IntrinsicSVGElements } from '@builder.io/qwik';
export const Icon${toPascalCase(name)} = component$<IntrinsicSVGElements['svg']>((props) => ${svg});
`;
}

async function getOneIcon(name: string, folder: string) {
  try {
    const url = iconUrl(name);
    const res = await fetch(url);
    const text = await res.text();
    const filename = toKebabCase(name);
    const component = svgComponent(name, text);
    const file = join(folder, `${filename}.tsx`);
    await writeFile(file, component);
    return filename;
  } catch(err) {
    throw new Error(`[SVG - ${name}] ${err}`);
  }
}

export async function getAllIcons(folder: string) {
  const res = await fetch(listUrl);
  const txt = await res.text();
  const metadata = JSON.parse(txt.slice(4)) as Metadata; // Remove leading )]}'
  const icons = metadata.icons as Icon[];
  if (!existsSync(folder)) await mkdir(folder, { recursive: true });
  const names = Array.from(new Set(icons.map(i => i.name)));
  const promises = names.map(name => getOneIcon(name, folder));
  const operations = await Promise.allSettled(promises);
  const filenames: string[] = [];
  for (const operation of operations) {
    if (operation.status === 'rejected') console.error(operation.reason);
    else filenames.push(operation.value);
  }
  const index = join(folder, 'index.ts');
  await writeFile(index, filenames.map(name => `export * from './${name}';`).join('\n'));
}
