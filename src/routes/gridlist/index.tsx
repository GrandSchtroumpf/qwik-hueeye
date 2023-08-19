import { component$, useSignal, useStyles$ } from "@builder.io/qwik";
import { NavGrid, GridLink, ActionGrid, GridButton, Modal } from "qwik-hueeye";
import pokemons from './pokemon.json';
import styles from './index.scss?inline';

interface Item {
  name: string;
  img: string;
}

const ItemButton = component$(({ item }: { item: Item }) => {
  const open = useSignal(false);
  return <>
    <GridButton onClick$={() => open.value = true}>
      <img width="150" height="150" src={item.img} alt={item.name} />
      <h3>{item.name}</h3>
    </GridButton>
    <Modal open={open}>
      <img width="150" height="150" src={item.img} alt={item.name} />
      <h3>{item.name}</h3>
    </Modal>
  </>
})

export default component$(() => {
  useStyles$(styles);
  return <section id="grid-page" aria-labelledby="grid-title">
    <h1 id="grid-title">Grid</h1>
    <article>
      <h2>Navigation Grid</h2>
      <p>Use arrow keys to navigate through the list</p>
      <NavGrid>
        {pokemons.slice(0, 20).map(p => (
          <GridLink key={p.name} href={p.name}>
          <img width="150" height="150" src={p.img} alt={p.name} />
          <h3>{p.name}</h3>
        </GridLink>
        ))}
      </NavGrid>
    </article>
    <article>
      <h2>Action Grid</h2>
      <ActionGrid>
        {pokemons.slice(21, 40).map(p => <ItemButton key={p.name} item={p}/>)}
      </ActionGrid>
    </article>
  </section>
})