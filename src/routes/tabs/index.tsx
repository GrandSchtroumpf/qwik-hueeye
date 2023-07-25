import { component$, useStyles$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { FormField, Input, Label } from "qwik-hueeye";
import { Tab, TabGroup, TabList, TabPanel, TabPanelList } from "qwik-hueeye";
import styles from './index.scss?inline';

export default component$(() => {
  useStyles$(styles);
  return <TabGroup id="tab-page">
    <TabList>
      <Tab id="1">Form</Tab>
      <Tab id="2">List</Tab>
      <Tab id="3">Lorem Ipsum</Tab>
    </TabList>
    <TabPanelList>
      <TabPanel tabId="1">
        <FormField>
          <Label>Name</Label>
          <Input placeholder="Name"/>
        </FormField>
        <FormField>
          <Label>Age</Label>
          <Input placeholder="Age" type="number"/>
        </FormField>
      </TabPanel>
      <TabPanel tabId="2">
        <ul>
          <li>One</li>
          <li>Two</li>
          <li>Three</li>
          <li>One</li>
          <li>Two</li>
          <li>Three</li>
        </ul>
      </TabPanel>
      <TabPanel tabId="3">
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel, est voluptas excepturi alias, ullam minima, debitis dolorem quod magni sit autem sed ab! Dicta doloremque obcaecati amet! Tempora, maxime explicabo!</p>
      </TabPanel>
    </TabPanelList>
  </TabGroup>
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