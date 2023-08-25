# List

## Navlist

This is a simple list of link with some a11y bonus:
- keyboard navigation
- set `aria-current="page"` if current page

Note: there are some known [issues](https://github.com/BuilderIO/qwik/issues/4041) with the `aria-current="page"`.

For SPA navigation
```jsx
{/* You should put an aria-label "primary" if this is the primary navigation */}
<Navlist aria-label="primary">
  <LinkItem href="/">Main page</LinkItem>
  <LinkItem href="/products">Products</LinkItem>
  <LinkItem href="/pricing">Pricing</LinkItem>
</Navlist>
```

For SSR navigation
```jsx
<Navlist aria-label="primary">
  <AnchorItem href="/">Main page</AnchorItem>
  <AnchorItem href="/products">Products</AnchorItem>
  <AnchorItem href="/pricing">Pricing</AnchorItem>
</Navlist>
```