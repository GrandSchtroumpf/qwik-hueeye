import { component$, useStyles$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { FormField, Input, Label } from "qwik-hueeye";
import { Tab, TabGroup } from "qwik-hueeye";
import styles from './index.scss?inline';

export default component$(() => {
  useStyles$(styles);
  return <section id="tab-page" aria-labelledby="tab-title">
    <h1 id="tab-title">Tabs</h1>
    <TabGroup noAnimation>
      <Tab label="Form">
        <FormField>
          <Label>Name</Label>
          <Input placeholder="Name"/>
        </FormField>
        <FormField>
          <Label>Age</Label>
          <Input placeholder="Age" type="number"/>
        </FormField>
      </Tab>
      <Tab label="List">
        <ul>
          <li>One</li>
          <li>Two</li>
          <li>Three</li>
          <li>One</li>
          <li>Two</li>
          <li>Three</li>
        </ul>
      </Tab>
      <Tab label="Lorem Ipsum">
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel, est voluptas excepturi alias, ullam minima, debitis dolorem quod magni sit autem sed ab! Dicta doloremque obcaecati amet! Tempora, maxime explicabo!</p>
      </Tab>
    </TabGroup>
  </section>
});

export const head: DocumentHead = () => {
  return {
    title: "Tabs",
    meta: [
      {
        name: 'description',
        content: 'Tabs component built with Qwik',
      }
    ],
  };
};