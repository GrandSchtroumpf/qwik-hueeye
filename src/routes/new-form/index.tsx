import { $, component$, useStore, useStyles$ } from "@builder.io/qwik";
import { CheckAll, CheckItem, CheckList, Form, GroupController, Input, ListController, Radio, RadioGroup, ToggleGroup, Toggle, Slider } from "../../components/base-form";
import styles from './index.scss?inline';
import { FormField } from "../../components/base-form/form-field/form-field";
import { Select } from "../../components/base-form/select/select";
import { Option } from "../../components/base-form/option/option";
import { SwitchGroup, Switch } from "../../components/base-form/checkbox/switch";
import { Range, RangeEnd, RangeStart } from "../../components/base-form/slider/range";
import { ToggleItem, ToggleList } from "../../components/base-form/checkbox/toggle";

export default component$(() => {
  useStyles$(styles)
  const form = useStore({
    name: 'John',
    age: 42,
    justify: 'center',
    movie: 'lotr',
    align: ['top'],
    optional: 'center',
    switch: {
      a: true,
      b: false,
    },
    range: {
      from: 10,
      to: 90
    },
    users: [
      { name: 'julius' }
    ] as { name: string, age: number }[],
  }, { deep: true });

  const submit = $(() => {
    console.log('SUBMITTED')
    console.log(form);
  })
  return (
    <section class="control-section">
      <h2>Form with value</h2>
      <Form bind:value={form} onSubmit$={submit}>
        <Input name="name" />
        <Input name="age" type="number" />
        <FormField>
          <Select placeholder="Select multiple movie" name="movies" multi>
            <Option value="lotr">Lord of the Ring</Option>
            <Option value="matrix">Matrix</Option>
            <Option value="star-wars">Star Wars</Option>
          </Select>
        </FormField>
        <h3 id="radio-group">Justify</h3>
        <RadioGroup name="justify" aria-labelledby="radio-group">
          <Radio value="bottom">Bottom</Radio>
          <Radio value="center">Center</Radio>
          <Radio value="top">Top</Radio>
        </RadioGroup>
        <h3 id="toggle-group">Toggle Group</h3>
        <ToggleGroup name="optional" class="outline round toggle-group">
          <Toggle class="vertical" value="bottom">Bottom</Toggle>
          <Toggle class="vertical" value="center">Center</Toggle>
          <Toggle class="vertical" value="top">Top</Toggle>
        </ToggleGroup>
        <h3 id="toggle-list">Toggle List</h3>
        <ToggleList name="align" class="outline flat">
          <ToggleItem value="bottom">Bottom</ToggleItem>
          <ToggleItem value="center">Center</ToggleItem>
          <ToggleItem value="top">Top</ToggleItem>
        </ToggleList>
        <h3>Check List</h3>
        <CheckList name="align">
          <CheckAll>All</CheckAll>
          <CheckItem value="bottom">Bottom</CheckItem>
          <CheckItem value="center">Center</CheckItem>
          <CheckItem value="top">Top</CheckItem>
        </CheckList>
        <h3>Switch Group</h3>
        <SwitchGroup name="switch" class="outline">
          <Switch name="a">Switch A</Switch>
          <Switch name="b">Switch B</Switch>
        </SwitchGroup>
        <h3>Slider</h3>
        <Slider name="age" min={0} max={100} step={1} />
        <h3>Range</h3>
        <Range name="range" min={0} max={100} step={1}>
          <RangeStart name="from" />
          <RangeEnd name="to" />
        </Range>
        <h3>List Controller</h3>
        <ListController name="users">
          <ul>
            {form.users.map((user, i) => (
              <li key={i}>
                <GroupController name={i}>
                  <Input name="name"/>
                  <Input name="age" type="number" />
                </GroupController>
              </li>
            ))}
          </ul>
          <button class="btn" type="button" onClick$={() => form.users.push({ name: '', age: 0 })}>
            Add User
          </button>
        </ListController>
        <button class="btn fill" type="submit">Submit</button>
      </Form>
    </section>
  )
})