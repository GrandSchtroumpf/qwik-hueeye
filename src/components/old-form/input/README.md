# Input
type: `string` | `number` | `Date` (`File` will be supported in the future)

## Date
Input with type `date` or `datetime-local` are bound with `Date`.
```jsx
<FormField>
  <Label>Date</Label>
  <Input type="date" value={new Date()} onValueChange={(value: Date) => console.log(value)}/>
</FormField>
```

Note: type `month` and `time` accept `Date` as `value`, but the output is a string:
```jsx
<FormField>
  <Label>Time</Label>
  <Input type="time" value={new Date()} onValueChange={(value: string) => console.log(value)}/>
</FormField>
```

## number
Input with type `number` are bound with `number`
```jsx
<FormField>
  <Label>Number</Label>
  <Input type="number" value={10} onValueChange={(value: number) => console.log(value)}/>
</FormField>
```

## string
Input with other types are bound `string`
```jsx
<FormField>
  <Label>Email</Label>
  <Input name="email" value="hueeye@mail.com" onValueChange={(email: string) => console.log(email)}/>
</FormField>
```