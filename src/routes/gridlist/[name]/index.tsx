import pokemons from '../pokemon.json';
import { component$ } from '@builder.io/qwik';
import { Link, StaticGenerateHandler, routeLoader$, useLocation } from '@builder.io/qwik-city';

export const usePokemon = routeLoader$((req) => {
  return pokemons.find(p => p.name === req.params.name)
});

export default component$(() => {
  // useStylesScoped$(styles);
  const { prevUrl, url } = useLocation();
  const pokemon = usePokemon();
  const back = prevUrl?.toString() === url.toString() ? '..' : prevUrl?.toString();
  return <>
    <nav aria-label="breadcrumb">
      <Link class="he-btn" href={back}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
        Pokedex
      </Link>
    </nav>
    <section>
      <img width="150" height="150" src={pokemon.value?.img} alt={pokemon.value?.name}/>
      <article>
        <h1>{pokemon.value?.name}</h1>
      </article>
    </section>
  </>
})

export const onStaticGenerate: StaticGenerateHandler = async () => {
  const params = pokemons.map(p => ({ name: p.name }));
  return { params };
};