import { component$, $, useStyles$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { ActionGrid, ButtonItem, Form, MatIcon, Toggle, ToggleGroup, useToaster, Switch } from "../../components";
import { IconWeight } from "../../components/icons/useIcon";
import icons from './material-icons.json';
import styles from './index.scss?inline';

export default component$(() => {
  useStyles$(styles);
  const paginator = useSignal<HTMLElement>()
  const limit = useSignal(200);
  const weight = useSignal<IconWeight>('400');
  const filled = useSignal(false);
  const toaster = useToaster();
  const copy = $((icon: { name: string }) => {
    navigator.clipboard.writeText(icon.name);
    toaster.add('Icon name copied to clipboard');
  });

  useVisibleTask$(() => {
    if (!paginator.value) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      limit.value = Math.min(icons.length, limit.value + 200);
      if (limit.value === icons.length) observer.disconnect();
    }, { rootMargin: '300px' });
    observer.observe(paginator.value);
    return () => observer.disconnect();
  })

  return (
    <section id="icon-page" aria-labelledby="icon-title">
      <h1 id="icon-title">Icons</h1>
      <p>Currently HueEye only support material icons</p>
      <Form role="search" class="search">
        <ToggleGroup bind:value={weight as any} class="round compact outline primary">
          <Toggle value="100">100</Toggle>
          <Toggle value="200">200</Toggle>
          <Toggle value="300">300</Toggle>
          <Toggle value="400">400</Toggle>
          <Toggle value="500">500</Toggle>
        </ToggleGroup>
        <Switch bind:value={filled}>Filled</Switch>
      </Form>
      <ActionGrid class="icon-list">
        {icons.slice(0, limit.value).map(icon => (
        <ButtonItem key={icon.name} class="btn vertical" onClick$={() => copy({ name: 'arrow_back' })}>
          <MatIcon name={icon.name as any} width="48" height="48" weight={weight.value} filled={filled.value} />
          <p>{icon.name}</p>
        </ButtonItem>
        ))}
      </ActionGrid>
      {limit.value < icons.length && (
        <footer class="paginator" ref={paginator}>Loading more Icons</footer>
      )}
    </section>
  );
})