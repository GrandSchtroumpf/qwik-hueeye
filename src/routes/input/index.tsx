import { component$, useStyles$ } from "@builder.io/qwik";
import { FormField, Label, Input } from "qwik-hueeye";
import style from './index.scss?inline';


export default component$(() => {
  useStyles$(style);
  return <section id="input-page" aria-labelledby="input-title">
    <h1 id="input-title">Input</h1>
    <article>
      <h2>Input's styles</h2>
      <fieldset>
        <FormField>
          <Label>Default</Label>
          <Input placeholder="Some text" />
        </FormField>
        <FormField class="fill">
          <Label>Fill</Label>
          <Input placeholder="Some text" />
        </FormField>
        <FormField class="outline">
          <Label>Outline</Label>
          <Input type="email" placeholder="Some text" />
        </FormField>
        <FormField class="outline fill">
          <Label>Outline fill</Label>
          <Input placeholder="Some text" />
        </FormField>
      </fieldset>
    </article>

    <article>
      <h2>Date based inputs</h2>
      <p>Input with type <code>date</code> & <code>datetime-local</code> accept a <b>Date</b> as initial value and return a <b>Date</b></p>
      <fieldset class="date-inputs">
        <FormField class="outline">
          <Label>Date</Label>
          <Input type="date" name="date" placeholder="Today's date" />
        </FormField>
        <FormField class="outline">
          <Label>Datetime</Label>
          <Input type="datetime-local" name="datetime" placeholder="Today's datetime" />
        </FormField>
      </fieldset>
      <p>Input with type <code>time</code> & <code>month</code> accept a <b>Date</b> as initial value but return a <b>string</b></p>
      <fieldset class="date-inputs">
        <FormField class="outline">
          <Label>Time</Label>
          <Input type="time" name="time" placeholder="Today's time" />
        </FormField>
        <FormField class="outline">
          <Label>Month</Label>
          <Input type="month" name="month" placeholder="Today's month" />
        </FormField>
      </fieldset>
    </article>

  </section>
})