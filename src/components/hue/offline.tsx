import { $, component$, useSignal, useTask$ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { isBrowser, isDev } from "@builder.io/qwik/build";
import { QwikManifest } from "@builder.io/qwik/optimizer";

type Priority = 'high' | 'low' | 'auto';
interface PrefetchBundles {
  [filename: string]: Priority;
}

export const useOffline = () => {
  const location = useLocation();
  const bundles = useSignal<PrefetchBundles>({});
  useTask$(async () => {
    if (isDev || isBrowser) return;
    const res = await fetch(`${location.url.origin}/q-manifest.json`);
    const result: QwikManifest = await res.json();
    const paths = new Map<string, Priority>();
    for (const bundle of Object.values(result.mapping)) {
      const imports = result.bundles[bundle]?.imports ?? [];
      const dynamicImports = result.bundles[bundle]?.dynamicImports ?? [];
      paths.set(bundle, 'auto');
      imports.forEach((path) => paths.set(path, 'auto'));
      dynamicImports.forEach((path) => paths.set(path, 'low'));
    }
    bundles.value = Object.fromEntries(paths.entries());
  });
  const preload = $(() => {
    for (const [file, priority] of Object.entries(bundles.value)) {
      const link = document.createElement('link');
      link.rel = 'modulepreload';
      link.href = `build/${file}`;
      link.fetchPriority = priority;
      document.documentElement.appendChild(link);
    }
  });
  return { bundles, preload };
}

export const Offline = component$(() => {
  const { bundles } = useOffline();
  return (
    <>
      {Object.entries(bundles.value).map(([file, priority]) => (
        <link key={file} rel="modulepreload" href={`build/${file}`} fetchPriority={priority} />)
      )}
    </>
  )
});