import { component$, useSignal, useStyles$ } from "@builder.io/qwik";
import { FormField, Input, Label } from "qwik-hueeye-lib";
import style from './index.scss?inline';


export default component$(() => {
  useStyles$(style);
  const text = useSignal('Hello World');
  const number = useSignal(42);
  const date = useSignal(new Date());
  const datetime = useSignal(new Date());
  const time = useSignal(new Date());
  const month = useSignal(new Date());
  return <section id="input-page" aria-labelledby="input-title">
    <h1 id="input-title">Input</h1>
    <article>
      <h2>Input's styles</h2>
      <fieldset>
        <legend>Flat</legend>
        <Input placeholder="Default" class="flat"/>
        <Input placeholder="Underline" class="flat underline" />
        <Input placeholder="Fill" class="flat fill"/>
        <Input placeholder="Outline" class="flat outline" />
        <Input placeholder="Underline Fill" class="flat underline fill" />
        <Input placeholder="Outline Fill" class="flat outline fill" />
      </fieldset>
      <fieldset>
        <legend>Default</legend>
        <Input placeholder="Default"/>
        <Input placeholder="Underline" class="underline" />
        <Input placeholder="Fill" class="fill"/>
        <Input placeholder="Outline" class="outline" />
        <Input placeholder="Underline Fill" class="underline fill" />
        <Input placeholder="Outline Fill" class="outline fill" />
      </fieldset>
      <fieldset>
        <legend>Round</legend>
        <Input placeholder="Default" class="round"/>
        <Input placeholder="Underline" class="round underline" />
        <Input placeholder="Fill" class="round fill"/>
        <Input placeholder="Outline" class="round outline" />
        <Input placeholder="Underline Fill" class="round underline fill" />
        <Input placeholder="Outline Fill" class="round outline fill" />
      </fieldset>
    </article>

    <article>
      <h2>Typed Input</h2>
      <section>
        <h3>Text</h3>
        <FormField class="form-field">
          <Label>Text</Label>
          <Input type="text" name="text" placeholder="Text" class="outline" bind:value={text}/>
        </FormField>
        <output>Output: {text.value}</output>
      </section>
      <section>
        <h3>Number</h3>
        <FormField>
          <Label>Number</Label>
          <Input type="number" name="number" placeholder="Number" class="outline" bind:value={number}/>
        </FormField>
        <output>Output: {number.value}</output>
      </section>
      <section>
        <h3>Date</h3>
        <p>Input with type <code>date</code> & <code>datetime-local</code> accept a <b>Date</b> as initial value and return a <b>Date</b></p>
        <FormField>
          <Label>Date</Label>
          <Input type="date" name="date" placeholder="Date" class="outline" bind:value={date}/>
        </FormField>
        <output>Output: {date.value.toString()}</output>
        <FormField>
          <Label>Datetime</Label>
          <Input type="datetime-local" name="datetime" placeholder="Datetime" class="outline" bind:value={datetime}/>
        </FormField>
        <output>Output: {datetime.value.toString()}</output>
      </section>
      <section>
        <h3>Date (input) / String (output)</h3>
        <p>Input with type <code>time</code> & <code>month</code> accept a <b>Date</b> as initial value but return a <b>string</b></p>
        <FormField>
          <Label>Time</Label>
          <Input type="time" name="time" placeholder="Time" class="outline" bind:value={time} />
        </FormField>
        <output>Output: {time.value.toString()}</output>
        <FormField>
          <Label>Month</Label>
          <Input type="month" name="month" placeholder="Month" class="outline" bind:value={month}/>
        </FormField>
        <output>Output: {month.value.toString()}</output>
      </section>
    </article>

  </section>
})