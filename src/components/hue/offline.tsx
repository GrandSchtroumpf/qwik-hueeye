import { component$, sync$, useVisibleTask$ } from "@builder.io/qwik"
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
