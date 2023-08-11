# Form
HueEye comes with some built-in components to manage form values.

They all integrate closely with the root `Form` element. 

```jsx
export default component$(() => {
  const user = useCurrentUser(); // not part of hueeye
  const update = event$((value: User) => updateUser(value));
  return <Form initialValue={user} onSubmit$={update}>
    <FormField>
      <Label>Email</Label>
      <Input name="email" type="email" placeholder="Email"/>
    </FormField>
    <FormField>
      <Label>Username</Label>
      <Input name="username" placeholder="Username"/>
    </FormField>
  </Form>
})
```

The `Form` element will dispatch the value to all it's controls based on the name.
Each component will know how to handle the value from the `initialValue`.

## Input
type: `string` | `number` (`Date` will be supported in the future)
```jsx
<Form initialValue={{ usename: 'Bob' }}>
  <FormField>
    <Label>Username</Label>
    <Input name="username" placeholder="Username"/>
  </FormField>
</Form>
```

## Select
type: `string`
```jsx
<Form initialValue={{ movie: 'titanic' }}>
  <FormField>
    <Label>Select a movie for tonight</Label>
    <Select name="movie" placeholder="Movie">
      <Option>-- Select a movie --</Option>
      <Option value="lotr">Lord of the Ring</Option>
      <Option value="titanic">Titanic</Option>
      <Option value="babylon">Babylon</Option>
    </Select>
  </FormField>
</Form>
```

## Select multi
type: `string[]`
```jsx
<Form initialValue={{ movies: ['titanic', 'babylon'] }}>
  <FormField>
    <Label>Select a movie for this week</Label>
    <Select name="movies" placeholder="Movie" multi>
      <Option value="lotr">Lord of the Ring</Option>
      <Option value="titanic">Titanic</Option>
      <Option value="babylon">Babylon</Option>
    </Select>
  </FormField>
</Form>
```

## Checklist
type: `string[]`
```jsx
<Form initialValue={{ types: ['normal', 'poison'] }}>
  <CheckGroup name="types">
    <legend>Select the type of your pokemon</legend>
    <CheckAll>All types</CheckAll>
    <CheckList>
      <CheckItem value="normal">Normal</CheckItem>
      <CheckItem value="fire">Fire</CheckItem>
      <CheckItem value="psychic">Psychic</CheckItem>
      <CheckItem value="poison">Poison</CheckItem>
    </CheckList>
  </CheckGroup>
</Form>
```

## Checkbox
type: `boolean`
```jsx
<Form initialValue={ isChecked: false }>
  <Checkbox name="isChecked">
    Check me
  </Checkbox>
</Form>
```

## Swith Group
type: `Record<string, boolean>`
```jsx
<Form initialValue={{ notifications: { email: true, phone: false } }}>
  <SwitchGroup name="notifications">
    <legend>Notifications</legend>
    <Switch name="email">Email</Switch>
    <Switch name="phone">Phone</Switch>
  </SwitchGroup>
</Form>
```

## Radio group
type: `string`
```jsx
<Form initialValue={{ pokemon: 'charmader' }}>
  <RadioGroup name="pokemon">
    <legend>Select your Pokemon</legend>
    <Radio value="bulbasaur">Bulbasaur</Radio>
    <Radio value="charmader">Charmader</Radio>
    <Radio value="squirtle">Squirtle</Radio>
  </RadioGroup>
</Form>
```

## Toggle
type: `string`
```jsx
<Form initialValue={{ color: 'green' }}>
  <ToggleGroup name="color">
    <legend>Select a color</legend>
    <Toggle value="red">Red</Toggle>
    <Toggle value="green">Green</Toggle>
    <Toggle value="blue">Blue</Toggle>
  </ToggleGroup>
</Form>
```

## Toggle multi
type: `string[]`
```jsx
<Form initialValue={{ toppings: ['cheese', 'mushroom'] }}>
  <MultiToggleGroup name="toppings">
    <legend>Which toppings for your Pizza ?</legend>
    <Toggle value="pepperoni">Pepperoni</Toggle>
    <Toggle value="cheese">Cheese</Toggle>
    <Toggle value="mushroom">Mushroom</Toggle>
  </MultiToggleGroup>
</Form>
```

## Slider
type: `number`
```jsx
<Form initialValue={{ hue: 250 }}>
  <label for="hue-slider">Hue</label>
  <Slider id="hue-slider" name="hue" />
</Form>
```

## Range
type: `{ start: number, end: number }`
```jsx
<Form initialValue={{ price: { start: 0, end: 200 } }}>
  <Range name="price" min="0" max="1000">
    <legend>Select a range of price</legend>
    <ThumbStart />
    <ThumbEnd />
  </Range>
</Form>
```