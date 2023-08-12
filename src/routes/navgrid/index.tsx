import { component$ } from "@builder.io/qwik";
import { NavGrid, NavItemLink } from "../../components/navgrid/navgrid";
import pokemons from './pokemon.json';

export default component$(() => {
  return <>
    <p>Use arrow keys to navigate through the list</p>  
    <NavGrid>
      {pokemons.map(p => (
      <NavItemLink key={p.name} href={p.name}>
        <img width="149" height="149" src={p.sprites.other["official-artwork"].front_default} alt={p.name} />
        <h3>{p.name}</h3>
      </NavItemLink>
      ))}
    </NavGrid>
  </>
})