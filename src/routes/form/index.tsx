import { component$, event$, useStyles$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Form, Input, MultiSelect } from "qwik-hueeye";
import { Option } from "qwik-hueeye";
import { Range, Slider } from "qwik-hueeye";
import { FormField, Label } from "qwik-hueeye";
import { ToggleGroup, Toggle } from "qwik-hueeye";
import { useToaster } from "qwik-hueeye";
import { RadioGroup, Radio } from "qwik-hueeye";
import { CheckAll, CheckList, CheckItem } from "qwik-hueeye";
import { SwitchGroup, SwitchItem } from "qwik-hueeye";
import styles from './index.scss?inline';


const MOVIES = {
  "tt0499549": "Avatar",
  "tt0480249": "I Am Legend",
  "tt0416449": "300",
  "tt0848228": "The Avengers",
  "tt0993846": "The Wolf of Wall Street",
  "tt0816692": "Interstellar",
  "tt0944947": "Game of Thrones",
  "tt2306299": "Vikings",
  "tt3749900": "Gotham",
  "tt3281796": "Power",
  "tt2707408": "Narcos",
  "tt0903747": "Breaking Bad",
  "tt1211837": "Doctor Strange",
  "tt3748528": "Rogue One: A Star Wars Story",
  "tt2094766": "Assassin's Creed",
  "tt3322314": "Luke Cage"
};

export default component$(() => {
  useStyles$(styles);
  const toaster = useToaster();

  const save = event$((value: any, form: HTMLFormElement) => {
    toaster.add('Thank you 😊');
    console.log(value);
    form.reset();
  });

  const initial = {
    title: 'Hello World',
    date: new Date(),
    time: new Date(),
    month: new Date(),
    datetime: new Date(),
    select: ['tt0480249', 'tt0903747'],
    switch: {
      a: true,
      b: false,
    },
    slider: 50,
    range: {
      start: 10,
      end: 90
    },
    radio: 'c',
    checkbox: ['a', 'c'],
    toggle: 'medium'
  };

  return <Form id="form-page" onSubmit$={save} value={initial}>
    <FormField class="outline">
      <Label>Text here</Label>
      <Input name="title" placeholder="Some Text here" />
    </FormField>
    <fieldset class="date-inputs">
      <FormField class="outline">
        <Label>Date</Label>
        <Input type="date" name="date" placeholder="Today's date" />
      </FormField>
      <FormField class="outline">
        <Label>Time</Label>
        <Input type="time" name="time" placeholder="Today's date" />
      </FormField>
      <FormField class="outline">
        <Label>Month</Label>
        <Input type="month" name="month" placeholder="Today's date" />
      </FormField>
      <FormField class="outline">
        <Label>Datetime</Label>
        <Input type="datetime-local" name="datetime" placeholder="Today's date" />
      </FormField>
    </fieldset>
    <FormField class="outline">
      <Label>Select from the list</Label>
      <MultiSelect name="select" placeholder="Movie">
        {Object.entries(MOVIES).map(([id, title]) => (
          <Option key={id} value={id}>
            {title}
          </Option>
        ))}
      </MultiSelect>
    </FormField>
    <Slider name="slider" class="outline" aria-label="Sample slider"></Slider>
    <Range name="range" class="outline">
      <legend>Range</legend>
    </Range>
    <SwitchGroup name="switch" class="outline">
      <legend>Switches</legend>
      <SwitchItem name="a">Switch A</SwitchItem>
      <SwitchItem name="b">Switch B</SwitchItem>
    </SwitchGroup>
    <ToggleGroup name="toggle" class="outline primary">
      <legend>Toggle Group</legend>
      <Toggle value="low">low</Toggle>
      <Toggle value="medium">medium</Toggle>
      <Toggle value="high">high</Toggle>
    </ToggleGroup>
    <RadioGroup name="radio" class="outline">
      <legend>Radio Group</legend>
      <Radio value="a">Radio 1</Radio>
      <Radio value="b">Radio 2</Radio>
      <Radio value="c">Radio 3</Radio>
    </RadioGroup>
    <CheckList name="checkbox" class="outline">
      <legend>Some Checkbox</legend>
      <CheckAll>Check All</CheckAll>
      <CheckItem value="a">Checkbox 1</CheckItem>
      <CheckItem value="b">Checkbox 2</CheckItem>
      <CheckItem value="c">Checkbox 3</CheckItem>
    </CheckList>
    <footer class="form-actions">
      <button class="btn" type="reset">Cancel</button>
      <button class="btn-fill primary" type="submit">Save</button>
    </footer>
  </Form>;
});

export const head: DocumentHead = () => {
  return {
    title: "Form",
    meta: [
      {
        name: 'description',
        content: 'An example of form using several components built with Qwik',
      }
    ],
  };
};