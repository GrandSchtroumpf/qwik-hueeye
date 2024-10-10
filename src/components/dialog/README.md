# Dialog

There are two types of dialog :
- `modal`: will be displayed on top of the page with backdrop
- `popover`: will be displayed relative to another element

## Modal
Dialog displaye on the top of the page with backdrop background

```jsx
export default component$(() => {
  const open = useSignal(false);
  return <>
    <button class="he-btn-fill primary" onClick$={() => open.value = true}>
      Open Modal
    </button>
    <Modal open={open}>
      <article class="dialog-content">
        <h3>Modal</h3>
        <p>This is a modal</p>  
      </article>
      <footer class="dialog-actions">
        <button class="he-btn" onClick$={() => open.value = false}>Close</button>
      </footer>
    </Modal>
  </>
})
```
Available types are "modal", "bottom-sheet", "sidenav".
Default is "modal".

Here are some classes: 
- `"he-modal"`: dialog dislayed in the center of the page
- `"he-bottom-sheet"`: dialog displayed at the bottom of the page
- `"he-sidenav"`: dialog displayed at the left of the page
- `"he-dialog-content"`: main content of the dialog
- `"he-dialog-actions"`: most often a footer with action buttons

## popover
Dialog display next to an element. Hueeye will do it's best to not overflow the viewbox

```jsx
export default component$(() => {
  const origin = useSignal<HTMLElement>();
  const open = useSignal(false);
  return <>
    <button ref={origin} class="he-btn-fill primary" onClick$={() => open.value = true}>
      Open Modal
    </button>
    <Popover origin={origin} open={open} position="block">
      <article class="he-dialog-content">
        <h3>Modal</h3>
        <p>This is a modal</p>  
      </article>
      <footer class="dialog-actions">
        <button class="he-btn" onClick$={() => open.value = false}>Close</button>
      </footer>
    </Popover>
  </>
})
```
You need to define an origin element to the `Popover` element and specify how to position it: 
- `"block"`: below or on top if it overflow
- `"inline"`: on the right or on the left if it overflow (opposite for rtl)
Default if `"block"`.


## Eventss
For both `Modal` & `Dialog` you've got two events: 
- `onOpen$`: triggered when the dialog opens
- `onClose$`: triggered when the dialog closes