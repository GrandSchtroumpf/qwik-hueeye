# Navlist

This is a simple list of link with some a11y bonus:
- keyboard navigation
- use `ul` tag to annonce the amount of links
- set `aria-current="page"` if current page

Note: there are some known [issues](https://github.com/BuilderIO/qwik/issues/4041) with the `aria-current="page"`.

For SPA navigation
```jsx
{/* You should put an aria-label "primary" if this is the primary navigation */}
<Navlist aria-label="primary">
  <NavLink href="/">Main page</NavLink>
  <NavLink href="/products">Products</NavLink>
  <NavLink href="/pricing">Pricing</NavLink>
</Navlist>
```

For SSR navigation
```jsx
<Navlist aria-label="primary">
  <NavAnchor href="/">Main page</NavAnchor>
  <NavAnchor href="/products">Products</NavAnchor>
  <NavAnchor href="/pricing">Pricing</NavAnchor>
</Navlist>
```