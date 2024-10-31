import { component$, useStyles$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Accordion, Details, DetailsPanel, MatIcon, Summary } from "qwik-hueeye-lib";
import { FormField, Input, Label } from "qwik-hueeye-lib";
import styles from './index.scss?inline';

const List = component$(() => {
  return <ul>
    <li>One</li>
    <li>Two</li>
    <li>Three</li>
    <li>One</li>
    <li>Two</li>
    <li>Three</li>
  </ul>
})

export default component$(() => {
  useStyles$(styles);
  return (
    <Accordion>
      <Details>
        <Summary>
          <MatIcon name="dashboard" class="he-summary-prefix" />
          <span class="he-summary-title">Form</span>
        </Summary>
        <DetailsPanel>
          <FormField>
            <Label>Name</Label>
            <Input placeholder="Name"/>
          </FormField>
          <FormField>
            <Label>Age</Label>
            <Input placeholder="Age" type="number"/>
          </FormField>
        </DetailsPanel>
      </Details>
      <Details>
        <Summary>
        <MatIcon name="list" class="he-summary-prefix" />
          <span class="he-summary-title">List</span>
        </Summary>
        <DetailsPanel>
          <List/>
        </DetailsPanel>
      </Details>
      <Details>
        <Summary>
          <span class="he-summary-title">Lorem Ipsum</span>
        </Summary>
        <DetailsPanel>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis reprehenderit placeat cumque voluptatem sapiente nihil id obcaecati quasi omnis officia, numquam consectetur saepe porro nisi officiis similique dolorum. Assumenda, minus.</p>
        </DetailsPanel>
      </Details>
    </Accordion>
  );
});

export const head: DocumentHead = () => {
  return {
    title: "Accordion",
    meta: [
      {
        name: 'description',
        content: 'An accordion component built with Qwik',
      }
    ],
  };
};