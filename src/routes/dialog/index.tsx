import { component$, useSignal, useStyles$ } from "@builder.io/qwik";
import { Dialog } from "qwik-hueeye-lib";
import styles from './index.scss?inline';

export default component$(() => {
  useStyles$(styles);
  const openModal = useSignal(false);
  const openBottomSheet = useSignal(false);
  const openSidenav = useSignal(false);
  return <section id="dialog-page" aria-labelledby="dialog-title">
    <h2 id="dialog-title">Dialogs</h2>
    <div class="buttons">
      <button class="btn-fill primary" onClick$={() => openModal.value = true}>
        Open Modal
      </button>
      <button class="btn-fill secondary" onClick$={() => openBottomSheet.value = true}>
        Open Bottom Sheet
      </button>
      <button class="btn-fill gradient" onClick$={() => openSidenav.value = true}>
        Open Sidenav
      </button>
    </div>
    <Dialog class="container" bind:open={openModal}>
      <article class="modal-content">
        <h3>Modal</h3>
        <p>This is a modal</p>  
      </article>
      <footer class="modal-actions">
        <button class="btn" onClick$={() => openModal.value = false}>Close</button>
      </footer>
    </Dialog>
    <Dialog class="container" bind:open={openBottomSheet} type="bottom-sheet">
      <article class="modal-content">
        <h3>Bottom Sheet</h3>
        <p>This is a bottom sheet</p>  
      </article>
      <footer class="modal-actions">
        <button class="btn" onClick$={() => openBottomSheet.value = false}>Close</button>
      </footer>
    </Dialog>
    <Dialog class="container" bind:open={openSidenav} type="sidenav">
      <article class="modal-content">
        <h3>Sidenav</h3>
        <p>This is a sidenav</p>  
      </article>
      <footer class="modal-actions">
        <button class="btn" onClick$={() => openSidenav.value = false}>Close</button>
      </footer>
    </Dialog>
  </section>
})