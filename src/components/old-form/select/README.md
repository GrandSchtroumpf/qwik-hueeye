# Select

## Select one option
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

## Select multiple options
type: `string[]`
```jsx
<Form initialValue={{ movies: ['titanic', 'babylon'] }}>
  <FormField>
    <Label>Select a movie for this week</Label>
    <MultiSelect name="movies" placeholder="Movies">
      <Option value="lotr">Lord of the Ring</Option>
      <Option value="titanic">Titanic</Option>
      <Option value="babylon">Babylon</Option>
    </MultiSelect>
  </FormField>
</Form>
```

## Gotchas
By default `Select` display the textContent of the selected Option. This is not working wit SSR, therefore the text will be displayed after first load. To avoid that use the `display$` props to provide a custom method to display the content.