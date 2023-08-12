import { component$ } from '@builder.io/qwik';
import { Link, StaticGenerateHandler, useLocation } from '@builder.io/qwik-city';
import pokemons from '../pokemon.json';
import styles from './index.module.scss';

export default component$(() => {
  const { params, prevUrl, url } = useLocation();
  const pokemon = pokemons.find(p => p.name === params.name);
  const imgUrl = pokemon?.sprites.other["official-artwork"].front_default;
  const back = prevUrl?.toString() === url.toString() ? '..' : prevUrl?.toString();
  return <>
    <nav class={styles.nav} aria-label="breadcrumb">
      <Link class="btn" href={back}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
        Pokedex
      </Link>
    </nav>
    <section class={styles.section} >
      <img width="150" height="150" src={imgUrl} alt={pokemon?.name}/>
      <article>
        <h1>{pokemon?.name}</h1>
      </article>
    </section>
  </>
})

export const onStaticGenerate: StaticGenerateHandler = async () => {
  const params = pokemons.map(p => ({ name: p.name }));
  return { params };
};