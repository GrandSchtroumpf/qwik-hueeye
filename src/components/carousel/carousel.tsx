import type { Signal} from "@builder.io/qwik";
import { component$, createContextId, event$, Slot, useContext, useContextProvider, useId, useSignal, useStore, useStyles$, useTask$, useVisibleTask$ } from "@builder.io/qwik";
import styles from './carousel.scss?inline';

const CarouselContext = createContextId<{ ids: Signal<string[]> }>('CarouselContext');

export const Carousel = component$(() => {
  useStyles$(styles);
  const ref = useSignal<HTMLElement>();
  const ids = useSignal<string[]>([]);
  const state = useStore({
    previousId: '',
    nextId: '',
    previousVisible: false,
    nextVisible: true,
  })
  useContextProvider(CarouselContext, { ids });
  // TODO: remove after useContext is fixed in v2.0
  useContext(CarouselContext);
  useVisibleTask$(({ track }) => {
    track(() => ids.value);
    const obs = new IntersectionObserver((entries) => {
      if (entries.length > 1) return;
      const [entry] = entries;
      const id = entry.target.id;
      const index = ids.value.indexOf(id);
      const maxIndex = ids.value.length - 1;
      const leaving = !entry.isIntersecting;
      // TODO: Keep state of visible items.
      if (leaving) {
        if (index === 0) state.previousVisible = false;
        // not working with current rootMargin
        if (index === maxIndex) state.nextVisible = false;
      }
    }, { rootMargin: '0px -100% 0px 0px' });
    for (const id of ids.value) {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    }
    return () => obs.disconnect();
  });

  const previous = event$(() => {
    document.getElementById(state.previousId)?.scrollIntoView({behavior: 'smooth'});
  });
  const next = event$(() => {
    document.getElementById(state.previousId)?.scrollIntoView({behavior: 'smooth'});
  });

  return <div ref={ref} class="carousel">
    <button class="carousel-previous" hidden={!state.previousVisible} onClick$={previous}>
      <Slot name="previous"/>
    </button>
    <ul class="carousel-list">
      <Slot/>
    </ul>
    <button class="carousel-next" hidden={!state.nextVisible} onClick$={next}>
      <Slot name="next"/>
    </button>
  </div>
});

export const CarouselItem = component$(() => {
  const id = useId();
  const { ids } = useContext(CarouselContext);
  useTask$(() => {
    ids.value = ids.value.concat(id);
  });
  useVisibleTask$(() => {
    return () => ids.value = ids.value.filter(item => item !== id);
  });
  return <li id={id} class="carousel-item">
    <Slot/>
  </li>
});