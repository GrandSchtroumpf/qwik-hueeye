# Button

As btn are style only we can use it class CSS classes.
Here are some example of implementation
```jsx
export default component$(() => {
  return <>
    <button class="btn">basic button</button>
    <button class="btn-outline primary">outline button with primary color</button>
    <a class="btn-fill secondary">Fill anchor with primary color</a>
    <Link class="btn-icon warn">
      <svg>{/* Some warning icon */}</svg>
    </Link>
  </>
})
```
Currently the `btn-*` classes are included in the global style. It'll surely move into it's own context later.

You can also apply gradient on your btn: 
```jsx
export default component$(() => {
  return <>
    <button class="btn gradient">gradient btn</button>
    <button class="btn-outline gradient">gradient outline btn</button>
    <button class="btn-fill gradient">gradient fill btn</button>
    <button class="btn-icon gradient">
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <circle cx="12" cy="12" r="10"/>
      </svg>
    </button>
  </>
})
```