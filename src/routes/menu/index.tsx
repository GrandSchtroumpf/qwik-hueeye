import { component$, useStyles$ } from "@builder.io/qwik";
import { MenuRoot, MenuItemBtn, Menu, MenuTrigger, MenuItemTrigger, MenuRadio, MenuGroup } from "qwik-hueeye";
import styles from './index.scss?inline';

export default component$(() => {
  useStyles$(styles);
  return <section class="menus">
    <MenuRoot>
      <MenuTrigger class="btn-fill primary">
        Open a menu
        <Menu q:slot="menu">
          <MenuItemBtn>Item 1</MenuItemBtn>
          <MenuItemBtn>Item 2</MenuItemBtn>
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