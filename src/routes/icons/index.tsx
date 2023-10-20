import { component$, $, useStyles$ } from "@builder.io/qwik";
import { ActionGrid, ButtonItem, MatIcon, useToaster } from "../../components";
import icons from './material-icons.json';
import styles from './index.scss?inline';

export default component$(() => {
  useStyles$(styles);
  const toaster = useToaster();
  const copy = $((icon: { name: string }) => {
    navigator.clipboard.writeText(icon.name);
    toaster.add('Icon name copied to clipboard');
  });
  return (
    <section id="icon-page" aria-labelledby="icon-title">
      <h1 id="icon-title">Icons</h1>
      <p>Currently HueEye only support material icons</p>
      <ActionGrid class="icon-list">
        {icons.map(icon => (
        <ButtonItem key={icon.name} class="btn vertical" onClick$={() => copy({ name: 'arrow_back' })}>
          <MatIcon name={icon.name as any} width="48" height="48" />
          <p>{icon.name}</p>
        </ButtonItem>
        ))}
      </ActionGrid>
    </section>
  );
})