import { component$ } from '@builder.io/qwik';
import { HueEyeProvider } from "./components/hue/hue";
import { QwikCityProvider, RouterOutlet, ServiceWorkerRegister, useDocumentHead, useLocation  } from '@builder.io/qwik-city';

import './root.scss';

/**
 * The RouterHead component is placed inside of the document `<head>` element.
 */
export const RouterHead = component$(() => {
  const head = useDocumentHead();
  const loc = useLocation();

  return (
    <>
      <title>{head.title ?? 'Qwik Hueeye Playground'}</title>

      <link rel="canonical" href={loc.url.href} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />

      {head.meta.map((m) => (
        <meta key={m.key} {...m} />
      ))}

      {head.links.map((l) => (
        <link key={l.key} {...l} />
      ))}

      {head.styles.map((s) => (
        <style key={s.key} {...s.props} dangerouslySetInnerHTML={s.style} />
      ))}
    </>
  );
});




export default () => {

  return (
    <QwikCityProvider>
      <head>
        <meta charSet="utf-8" />
        <RouterHead />
      </head>
      <body>
        <HueEyeProvider>
          <RouterOutlet />
          <ServiceWorkerRegister />
        </HueEyeProvider>
      </body>
    </QwikCityProvider>
  );
};
