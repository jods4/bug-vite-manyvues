<route>
  path: /
</route>

<template>
  <main class="dev-docs">
    <h2>Imports</h2>
    <pre v-highlight>
import { ContextMenuApi, ContextMenu, MenuItem, MenuSeparator } from "@/Components/Menu";</pre
    >

    <h2>Context menu</h2>

    <p>
      <code>&lt;menu-item&gt;</code>
      has a
      <code>default</code>
      slot for its label and an optional
      <code>items</code>
      slot to nest deeper menu levels.
    </p>

    <p>
      Invoking
      <code>opentAt({ x, y })</code>
      on the menu itself opens it at a specific position.
    </p>

    <p>
      This would typically be done on a right click with
      <code>@click.right.prevent="menu.openAt($event)</code>
      , as mouse events have x,y coordinates. Notice that
      <code>@click.right</code>
      is actually translated by Vue to
      <code>@contextmenu</code>
      , which is the correct HTML event to handle right-click and prevent the
      default context menu from opening:
      <code>@contextmenu.prevent="menu.openAt($event)"</code>
      .
    </p>

    <div
      @click="menu.openAt($event)"
      @contextmenu.prevent="menu.openAt($event)"
      style="
        padding: 16px;
        border: 1px dashed rgb(19, 159, 214);
        text-align: center;
      "
    >
      Click or right-click here
    </div>

    <context-menu ref="menu">
      <menu-item @click="info('With icon')">
        <icon-tools />
        With icon
      </menu-item>
      <menu-item @click="info('Blank icon')">
        <i class="icon" />
        Blank icon
      </menu-item>
      <menu-separator />
      <menu-item>
        Level
        <template #items>
          <menu-item @click="notify('success', 'Like a champ!')">
            Success
          </menu-item>
          <menu-item @click="notify('warn', 'Slippery floor')">Warn</menu-item>
          <menu-item @click="notify('error', 'Learn from your mistakes')">
            Error
          </menu-item>
        </template>
      </menu-item>
      <menu-item>
        Animal
        <template #items>
          <menu-item
            v-for="a of ['Dog', 'Cat', 'Hamster', 'Dragon']"
            v-text="a"
            @click="info(`So you like ${a}?`)"
          />
          <menu-item>
            More...
            <template #items>
              <menu-item
                v-for="a of [
                  'Leafy seadragon',
                  'Fanfin Angler',
                  'Atepolus Frog',
                  'Centipede',
                ]"
                v-text="a"
                @click="info(a + ' is so cool')"
              />
            </template>
          </menu-item>
        </template>
      </menu-item>
    </context-menu>

    <pre v-highlight v-text="source" />
  </main>
</template>

<script setup lang="ts">
  import outdent from "outdent";
  import { ref } from "vue";
  import { ContextMenu, MenuItem, MenuSeparator } from "@/Components/Menu";
  import type { ContextMenuApi } from "@/Components/Menu";
  import IconTools from "@/Icons/tools.svg";
  import { info, notify } from "@/System/notify";
  import vHighlight from "./Components/hl-code";

  const menu = ref<ContextMenuApi>(null!);

  const source = outdent`
    <div
      @click="menu.openAt($event)"
      @contextmenu.prevent="menu.openAt($event)"
    >
      Open menu
    </div>

    <context-menu ref="menu">
      <menu-item @click="info('With icon')">
        <icon-tools />
        With icon
      </menu-item>
      <menu-item @click="info('Blank icon')">
        <i class="icon" />
        Blank icon
      </menu-item>
      <menu-separator />
      <menu-item>
        Level
        <template #items>
          <menu-item>Success</menu-item>
          <menu-item>Warn</menu-item>
          <menu-item>Error</menu-item>
        </template>
      </menu-item>
    </context-menu>`;
</script>
