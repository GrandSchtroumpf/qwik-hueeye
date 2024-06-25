import { component$, useStyles$ } from "@builder.io/qwik";
import { MenuRoot, MenuItemBtn, Menu, MenuTrigger, MenuRadio, MenuGroup, MenuPopover, MenuItemTrigger } from "qwik-hueeye-lib";
import styles from './index.scss?inline';

export default component$(() => {
  useStyles$(styles);
  return <section class="menus">
    <MenuRoot>
      <MenuTrigger class="btn-fill primary">
        Open a menu
      </MenuTrigger>
      <MenuPopover>
        <Menu>
          <MenuItemBtn>Item 1</MenuItemBtn>
          <MenuItemBtn>Item 2</MenuItemBtn>
          <MenuItemTrigger id="radio">Menu Radio</MenuItemTrigger>
        </Menu>
      </MenuPopover>
      <MenuPopover anchor="radio">
        <Menu id="radio">
          <MenuItemBtn>Back</MenuItemBtn>
          <MenuGroup>
            <MenuRadio name="radio" value="1">Item 1</MenuRadio>
            <MenuRadio name="radio" value="2">Item 2</MenuRadio>
          </MenuGroup>
        </Menu>
      </MenuPopover>
    </MenuRoot>
  </section>
})