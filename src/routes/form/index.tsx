import { component$, event$, useStore, useStyles$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { AddControl, Form, GroupController, Input, ListController, MatIcon, Option, RangeEnd, RangeStart, RemoveControl, Select } from "qwik-hueeye-lib";
import { Range, Slider } from "qwik-hueeye-lib";
import { FormField, Label } from "qwik-hueeye-lib";
import { ToggleGroup, Toggle } from "qwik-hueeye-lib";
import { useToaster } from "qwik-hueeye-lib";
import { RadioGroup, Radio } from "qwik-hueeye-lib";
import { CheckAll, CheckList, CheckItem } from "qwik-hueeye-lib";
import { SwitchGroup, Switch } from "qwik-hueeye-lib";
import { HeAutocomplete } from "../../components/form/autocomplete";
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

  const save = event$((value: any) => {
    toaster.add('Thank you 😊');
    console.log(value);
  });

  const control = useStore({
    title: 'Hello World',
    movie: '',
    date: new Date(),
    time: new Date(),
    month: new Date(),
    datetime: new Date(),
    selectMulti: ['tt0480249', 'tt0848228'],
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
    toggle: 'medium',
    list: [],
    listObject: [],
  });

  return <Form id="form-page" bind:value={control} onFormSubmit$={save}>
    <FormField class="overlay">
      <Label>Some Text here</Label>
      <Input name="title" placeholder="Some Text here" class="outline"/>
    </FormField>
    <FormField>
      <Label>Autocomplete</Label>
      <HeAutocomplete placeholder="Select movie" name="movie" class="outline" datalist={Object.values(MOVIES)} />
    </FormField>
    <fieldset class="date-inputs">
      <FormField>
        <Label>Date</Label>
        <Input type="date" name="date" placeholder="Today's date" class="outline"/>
      </FormField>
      <FormField>
        <Label>Time</Label>
        <Input type="time" name="time" placeholder="Today's date" class="outline"/>
      </FormField>
      <FormField>
        <Label>Month</Label>
        <Input type="month" name="month" placeholder="Today's date" class="outline"/>
      </FormField>
      <FormField>
        <Label>Datetime</Label>
        <Input type="datetime-local" name="datetime" placeholder="Today's date" class="outline"/>
      </FormField>
    </fieldset>
    <FormField>
      <Label>Select from the list</Label>
      <Select multi name="selectMulti" placeholder="Movie" class="round outline">
        {Object.entries(MOVIES).map(([id, title]) => (
          <Option key={id} value={id}>
            {title}
          </Option>
        ))}
      </Select>
    </FormField>
    <Select name="radio" class="outline">
      <Option value="a">Option 1</Option>
      <Option value="b">Option 2</Option>
      <Option value="c">Option 3</Option>
    </Select>
    <Slider name="slider" class="outline" aria-label="Sample slider"></Slider>
    <h3>Range</h3>
    <Range name="range" class="outline">
      <RangeStart />
      <RangeEnd />
    </Range>
    <h3>Switches</h3>
    <SwitchGroup name="switch" class="outline">
      <Switch name="a">Switch A</Switch>
      <Switch name="b">Switch B</Switch>
    </SwitchGroup>
    <h3>Toggle Group</h3>
    <ToggleGroup name="toggle" class="outline primary">
      <Toggle value="low">low</Toggle>
      <Toggle value="medium">medium</Toggle>
      <Toggle value="high">high</Toggle>
    </ToggleGroup>
    <h3>Radio Group</h3>
    <RadioGroup name="radio" class="outline">
      <Radio value="a">Radio 1</Radio>
      <Radio value="b">Radio 2</Radio>
      <Radio value="c">Radio 3</Radio>
    </RadioGroup>
    <h3>Some Checkbox</h3>
    <CheckList name="checkbox" class="outline">
      <CheckAll>Check All</CheckAll>
      <CheckItem value="a">Checkbox 1</CheckItem>
      <CheckItem value="b">Checkbox 2</CheckItem>
      <CheckItem value="c">Checkbox 3</CheckItem>
    </CheckList>
    <h3>List of string</h3>
    <div>
      <ListController name="list">
        <AddControl class="he-btn" item="">Add Item</AddControl>
        <ul>
          {control.list.map((_, i) => (
            <li key={i}>
              <Input name={i} placeholder="Content"/>
              <RemoveControl index={i} class="he-btn-icon">
                <MatIcon name="close" />
              </RemoveControl>
            </li>
          ))}
        </ul>
      </ListController>
    </div>
    <h3>List of Object</h3>
    <div>
      <ListController name="listObject">
        <AddControl class="he-btn" item={{ key: '', value: '' }}>Add object</AddControl>
        <ul>
          {control.listObject.map((_, i) => (
            <GroupController key={i} name={i}>
              <li>
                <Input name="key" placeholder="Key"/>
                <Input name="value" placeholder="Value"/>
                <RemoveControl index={i} class="he-btn-icon">
                  <MatIcon name="close" />
                </RemoveControl>
              </li>
            </GroupController>
          ))}
        </ul>
      </ListController>
    </div>
    <footer class="form-actions">
      <button class="he-btn" type="reset">Cancel</button>
      <button class="he-btn-fill primary" type="submit">Save</button>
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