<template>
  <div
    ref="element"
    class="menu-item"
    :class="hasItems ? 'menu-group' : undefined"
    @click.stop="clicked"
    @mouseenter="mouseOver"
    @mouseleave="mouseOver"
  >
    <slot />
    <template v-if="hasItems">
      <icon-arrow class="ml-auto" />
      <context-menu ref="subMenu" @closed="subMenuClosed">
        <slot name="items" />
      </context-menu>
    </template>
  </div>
</template>

<script setup lang="ts">
  import debounce from "debounce";
  import { ref, useSlots } from "vue";
  import ContextMenu from "./context-menu.vue";
  import type { ContextMenuApi } from "./index";
  import IconArrow from "./arrow-right.svg";

  const slots = useSlots();

  const hasItems = !!slots.items;

  const element = ref<HTMLElement>(null!);
  const subMenu = ref<ContextMenuApi>(null!);

  function subMenuClosed() {
    element.value.closest<HTMLElement>("[tabindex]")?.focus();
  }

  function openSubMenu(anchor: Element) {
    subMenu.value.openNextTo(anchor, "right", [0, -4]);
  }

  function clicked(e: MouseEvent) {
    if (hasItems) openSubMenu(e.currentTarget! as Element);
    else e.target!.dispatchEvent(new Event("closemenu", { bubbles: true }));
  }

  const mouseOver = hasItems
    ? debounce((e: MouseEvent) => {
        if (e.type === "mouseenter") openSubMenu(e.target! as Element);
        // Notice that we can't just pass `e` to `clicked`, because when mouseenter doesn't bubble and so currentTarget isn't set.
        else subMenu.value?.close();
      }, 300)
    : undefined;
</script>

<style lang="postcss">
  @import "@/variables.css";

  .menu-item {
    display: flex;
    align-items: center;
    gap: 0.5em;
    padding: $pad $spacer;
    border: none;
    @include clickable;

    > .icon {
      color: $neutral;
      width: 1em;
    }
  }
</style>
