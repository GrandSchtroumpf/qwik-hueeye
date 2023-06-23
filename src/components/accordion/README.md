# Accordion

```jsx
<Accordion>
  <Details>
    <Summary>Tab 1</Summary>
    <DetailsPanel>
      {/* Content here */}
    </DetailsPanel>
  </Details>
  <Details>
    <Summary>Tab 2</Summary>
    <DetailsPanel>
      {/* Content here */}
    </DetailsPanel>
  </Details>
</Accordion>
```

The `DetailsPanel` has `display: none` by default, so on SSR navigation it will lazily trigger `useVisibleTask$`. On SPA navigation it'll be triggered eagerly though.