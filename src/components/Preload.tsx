import { component$, useVisibleTask$ } from "@builder.io/qwik"
import { manifest } from '@qwik-client-manifest';

const batchSize = 80;

export const PreloadAll = component$(() => {
  const bundles = Object.keys(manifest?.bundles ?? {}).map((bundle) => `/build/${bundle}`);
  
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    const template = document.getElementById('offline-preload') as HTMLTemplateElement;
    const links = template.content.cloneNode(true);
    if (!(globalThis as any).scheduler?.yield) {
      for (let i = 0; i < links.childNodes.length; i++) {
        document.head.appendChild(links.childNodes[i]);
      }
    } else {
      for (let i = 0; i < links.childNodes.length / batchSize; i++) {
        (globalThis as any).scheduler.postTask(() => {
          for (let j = 0; j < batchSize; j++) {
            const index = i * batchSize + j;
            if (index >= links.childNodes.length) break;
            document.head.append(links.childNodes[index]);
          }
        }, { priority: "background" });
      }
    }
  }, { strategy: 'document-idle' });

  return (
    <template id="offline-preload">
      {bundles.map((bundle, i) => (
        <link key={i} rel="modulepreload" href={bundle} fetchPriority="low" />
      ))}
    </template>
  );
})

// export const PrefetchTemplate = component$(() => {
//   useOnDocument('qprefetch', sync$((event: CustomEvent<{ bundles: string[] }>) => {
//     const { bundles } = (event as CustomEvent).detail;
//     if (!Array.isArray(bundles)) return;
//     for (const bundle of bundles) {
//       const template = document.getElementById(bundle) as HTMLTemplateElement;
//       const links = template.content.cloneNode(true);
//       document.head.appendChild(links);
//     }
//   }));

//   // eslint-disable-next-line qwik/no-use-visible-task
//   useVisibleTask$(sync$(() => {
//     const template = document.getElementById('offline-preload') as HTMLTemplateElement;
//     const links = template.content.cloneNode(true);
//     document.head.appendChild(links);
//   }), { strategy: 'document-idle' });

//   return Object.entries(manifest.bundles).map(([bundleName, bundle]) => (
//     <template key={bundleName} id={bundleName}>
//       {bundle.imports?.map((name) => (
//         <link key={name} rel="modulepreload" href={`/build/${name}`} />
//       ))}
//       {bundle.dynamicImports?.map((name) => (
//         <link key={name} rel="prefetch" as="script" href={`/build/${name}`} />
//       ))}
//     </template>
//   ))
// })

// export const PrefetchJSON = component$(() => {
//   // eslint-disable-next-line qwik/no-use-visible-task
//   useVisibleTask$(sync$(() => {
//     const script = document.getElementById('q-bundle-graph');
//     const content = script?.textContent;
//     if (!content) return;
//     const graph = JSON.parse(content);
//     (globalThis as any).scheduler.postTask(() => {
//       for (const bundle of Object.keys(graph)) {
//         const link = document.createElement('link');
//         link.setAttribute('href', `/build/${bundle}`);
//         link.setAttribute('rel', 'modulepreload');
//         document.head.appendChild(link);
//       }
//     }, { priority: "background" })
//   }), { strategy: 'document-idle' });
//   return (
//     <script id="q-bundle-graph" dangerouslySetInnerHTML={JSON.stringify(manifest.bundles)}></script>
//   )
// })