import { component$, event$, useStyles$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Form, Input, MultiSelect, Slider } from "qwik-hueeye";
import { Option } from "qwik-hueeye";
import { Range, ThumbEnd, ThumbStart } from "qwik-hueeye";
import { FormField, Label } from "qwik-hueeye";
import { ToggleGroup, Toggle } from "qwik-hueeye";
import { useToaster } from "qwik-hueeye";
import { RadioGroup, Radio } from "qwik-hueeye";
import { CheckAll, CheckGroup, CheckItem, CheckList } from "qwik-hueeye";
import { SwitchGroup, Switch } from "qwik-hueeye";
import styles from './index.scss?inline';


const MOVIES = [
  {
    "id": "tt0499549",
    "title": "Avatar"
  },
  {
    "id": "tt0480249",
    "title": "I Am Legend"
  },
  {
    "id": "tt0416449",
    "title": "300"
  },
  {
    "id": "tt0848228",
    "title": "The Avengers"
  },
  {
    "id": "tt0993846",
    "title": "The Wolf of Wall Street"
  },
  {
    "id": "tt0816692",
    "title": "Interstellar"
  },
  {
    "id": "tt0944947",
    "title": "Game of Thrones"
  },
  {
    "id": "tt2306299",
    "title": "Vikings"
  },
  {
    "id": "tt3749900",
    "title": "Gotham"
  },
  {
    "id": "tt3281796",
    "title": "Power"
  },
  {
    "id": "tt2707408",
    "title": "Narcos"
  },
  {
    "id": "tt0903747",
    "title": "Breaking Bad"
  },
  {
    "id": "tt1211837",
    "title": "Doctor Strange"
  },
  {
    "id": "tt3748528",
    "title": "Rogue One: A Star Wars Story"
  },
  {
    "id": "tt2094766",
    "title": "Assassin's Creed"
  },
  {
    "id": "tt3322314",
    "title": "Luke Cage"
  }
];

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
    select: [MOVIES[3].id, MOVIES[6].id],
    switch: {
      a: true,
      b: false,
    },
    range: {
      start: 10,
      end: 90
    },
    slider: 45,
    radio: 'c',
    checkbox: ['a', 'c'],
    toggle: 'medium'
  };

  return <Form class="form-page" onSubmit$={save} value={initial}>
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
        <Option>-- Select a movie --</Option>
        {MOVIES.map(movie => (
          <Option key={movie.id} value={movie.id}>
            {movie.title}
          </Option>
        ))}
      </MultiSelect>
    </FormField>
    <Range name="range" class="outline">
      <legend>Select a range</legend>
      <ThumbStart></ThumbStart>
      <ThumbEnd></ThumbEnd>
    </Range>
    <Slider name="slider" />
    <SwitchGroup name="switch" class="outline">
      <legend>Switches</legend>
      <Switch name="a">Switch A</Switch>
      <Switch name="b">Switch B</Switch>
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
    <CheckGroup name="checkbox" class="outline">
      <legend>Some Checkbox</legend>
      <CheckAll>Check All</CheckAll>
      <CheckList>
        <CheckItem value="a">Checkbox 1</CheckItem>
        <CheckItem value="b">Checkbox 2</CheckItem>
        <CheckItem value="c">Checkbox 3</CheckItem>
      </CheckList>
    </CheckGroup>
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