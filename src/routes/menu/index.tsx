import { component$, useStyles$ } from "@builder.io/qwik";
import { MenuRoot, MenuItem, Menu, MenuTrigger, MenuItemTrigger, MenuRadio, MenuGroup } from "qwik-hueeye";
import styles from './index.scss?inline';

export default component$(() => {
  useStyles$(styles);
  return <section class="menus">
    <MenuRoot>
      <MenuTrigger class="btn-fill primary">
        Open a menu
        <Menu q:slot="menu">
          <MenuItem>Item 1</MenuItem>
          <MenuItem>Item 2</MenuItem>
          <MenuItemTrigger>
            Menu Radio
            <Menu q:slot="menu">
              <MenuGroup>
                <MenuRadio name="radio" value="1">Item 1</MenuRadio>
                <MenuRadio name="radio" value="2">Item 2</MenuRadio>
              </MenuGroup>
            </Menu>
          </MenuItemTrigger>
        </Menu>
      </MenuTrigger>
    </MenuRoot>
  </section>
})