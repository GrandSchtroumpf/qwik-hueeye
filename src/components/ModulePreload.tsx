import { sync$, useOnDocument, useOnWindow } from "@builder.io/qwik";

export const useModulePreload = () => {
  // Initialize SW & cache
  useOnWindow(
    "DOMContentLoaded",
    sync$(async () => {
      const isDev = document.documentElement.getAttribute('q:render') === "ssr-dev";
      if ("serviceWorker" in navigator && !isDev) {
        await navigator.serviceWorker.register("/sw.js");
        await navigator.serviceWorker.ready;
        const modules = document.querySelectorAll('link[rel="modulepreload"]');
        const controller = navigator.serviceWorker.controller;
        const hrefs = Array.from(modules).map(
          (link) => (link as HTMLLinkElement).href
        );
        controller?.postMessage({ type: "init", value: hrefs });
      }
    })
  );

  // Listen on prefetch event
  useOnDocument('qprefetch', sync$((event: CustomEvent<{ bundles: string[] }>) => {
    const { bundles } = (event as CustomEvent).detail;
    if (!Array.isArray(bundles)) return;
    const base = document.documentElement.getAttribute("q:base") ?? "/";
    const isDev = document.documentElement.getAttribute('q:render') === "ssr-dev";
    const getHref = (bundle: string) => {
      if (isDev) return bundle;
      return `${base}${bundle}`.replace(/\/\./g, "");
    }
    const supportsModulePreload = document.querySelector('link')?.relList.supports('modulepreload');
    for (const bundle of bundles) {
      if (supportsModulePreload) {
        const link = document.createElement("link");
        link.rel = 'modulepreload';
        link.fetchPriority = 'low';
        link.href = getHref(bundle);
        // link.fetchPriority = "low";
        document.head.appendChild(link);
      } else {
        // triggers the sw
        fetch(getHref(bundle));
      }
    }
  }));
};
