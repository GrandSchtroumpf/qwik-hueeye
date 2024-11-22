import { component$, sync$, useOnDocument, useVisibleTask$ } from "@builder.io/qwik"
import { manifest } from '@qwik-client-manifest';

export const Offline = component$(() => {
  const bundles = Object.keys(manifest?.bundles ?? {}).map((bundle) => `/build/${bundle}`);
  
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(sync$(() => {
    const template = document.getElementById('offline-preload') as HTMLTemplateElement;
    const links = template.content.cloneNode(true);
    document.head.appendChild(links);
  }), { strategy: 'document-idle' });

  return (
    <template id="offline-preload">
      {bundles.map((bundle, i) => (
        <link key={i} rel="modulepreload" href={bundle} fetchPriority="low" />
      ))}
    </template>
  );
})

export const PrefetchTemplate = component$(() => {
  useOnDocument('qprefetch', sync$((event: CustomEvent<{ bundles: string[] }>) => {
    const { bundles } = (event as CustomEvent).detail;
    if (!Array.isArray(bundles)) return;
    for (const bundle of bundles) {
      const template = document.getElementById(bundle) as HTMLTemplateElement;
      const links = template.content.cloneNode(true);
      document.head.appendChild(links);
    }
  }));

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(sync$(() => {
    const template = document.getElementById('offline-preload') as HTMLTemplateElement;
    const links = template.content.cloneNode(true);
    document.head.appendChild(links);
  }), { strategy: 'document-idle' });

  return Object.entries(manifest.bundles).map(([bundleName, bundle]) => (
    <template key={bundleName} id={bundleName}>
      {bundle.imports?.map((name) => (
        <link key={name} rel="modulepreload" href={`/build/${name}`} />
      ))}
      {bundle.dynamicImports?.map((name) => (
        <link key={name} rel="prefetch" as="script" href={`/build/${name}`} />
      ))}
    </template>
  ))
})

export const PrefetchJSON = component$(() => {
  useOnDocument('qprefetch', sync$((event: CustomEvent<{ bundles: string[] }>) => {
    const { bundles } = (event as CustomEvent).detail;
    if (!Array.isArray(bundles)) return;
    const text = document.getElementById('q-bundle-graph')?.textContent;
    if (!text) return;
    // const graph = JSON.parse(text);
    // TODO
  }));
  return (
    <script id="q-bundle-graph">
      {JSON.stringify(manifest.bundles)}
    </script>
  )
})