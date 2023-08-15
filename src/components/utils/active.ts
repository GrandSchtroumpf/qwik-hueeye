export function moveActive(ul: HTMLElement, el: HTMLElement) {
  if (ul && el) {
    const origin = ul.getBoundingClientRect();
    const { width, height, top, left } = el.getBoundingClientRect();
    ul.style.setProperty('--active-width', `${width}px`);
    ul.style.setProperty('--active-height', `${height}px`);
    ul.style.setProperty('--active-left', `${Math.floor(left - origin.left)}px`);
    ul.style.setProperty('--active-top', `${Math.floor(top - origin.top)}px`);
    ul.style.setProperty('--active-display', 'block');
  } else if (ul) {
    ul.style.setProperty('--active-display', 'none');
  }
}

export function moveSelected(ul: HTMLElement, el: HTMLElement) {
  if (ul && el) {
    const origin = ul.getBoundingClientRect();
    const { width, height, top, left } = el.getBoundingClientRect();
    ul.style.setProperty('--selected-width', `${width}px`);
    ul.style.setProperty('--selected-height', `${height}px`);
    ul.style.setProperty('--selected-left', `${Math.floor(left - origin.left)}px`);
    ul.style.setProperty('--selected-top', `${Math.floor(top - origin.top)}px`);
    ul.style.setProperty('--selected-display', 'block');
  } else if (ul) {
    ul.style.setProperty('--selected-display', 'none');
  }
}
