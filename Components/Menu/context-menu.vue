<template>
  <div
    v-if="isOpen"
    v-anim="{ target: ':scope > div', enter: 'floatRight', leave: 'floatLeft' }"
    v-popper="popper"
    v-click-outside="{
      callback: close,
      closest: '.menu-group',
      events: ['pointerdown'],
    }"
    v-autofocus
    tabindex="0"
    @keydown="handleKey"
    @closemenu="close"
    class="z-10"
  >
    <div
      class="
        bg-white
        border border-gray-300
        rounded
        shadow-lg
        min-w-40
        whitespace-nowrap
      "
    >
      <keyboard-selection :item-type="MenuItem" @api="keys = $event">
        <slot />
      </keyboard-selection>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, markRaw, ref } from "vue";
  import { anim } from "../Directives/anim";
  import autofocus from "../Directives/autofocus";
  import { clickOutside} from "../Directives/click-outside";
  import { PopperOptions, popper } from "../Directives/popper";
  import KeyboardSelection, {
    KeyboardSelectionApi,
  } from "../Helpers/keyboard-selection";
  import { MenuPosition, MenuItem } from ".";
  import { Placement } from "@popperjs/core";

  export default defineComponent({
    directives: {
      autofocus,
      anim,
      clickOutside,
      popper,
    },

    components: {
      KeyboardSelection,
    },

    emits: {
      closed: () => true,
    },

    setup(props, { emit }) {
      const isOpen = ref(false);

      // HACK: break the type circularity between ContextMenu and MenuItem
      const anyMenuItem = MenuItem as any;

      const state = markRaw({
        popper: null! as PopperOptions,

        get isOpen() {
          return isOpen.value;
        },

        keys: null! as KeyboardSelectionApi,
        MenuItem: anyMenuItem,

        // FIXME: extract public API into expose() when it lands in Vue
        openAt(position: MenuPosition) {
          if (isOpen.value) return;

          const { x, y } = position;
          state.popper = {
            anchor: {
              getBoundingClientRect() {
                return {
                  top: y,
                  left: x,
                  bottom: y,
                  right: x,
                  width: 0,
                  height: 0,
                };
              },
            },
            placement: "right",
          };
          isOpen.value = true;
        },

        openNextTo(
          anchor: Element,
          placement: Placement = "right",
          offset?: [number, number],
        ) {
          if (isOpen.value) return;

          state.popper = {
            anchor,
            placement,
            offset,
          };
          isOpen.value = true;
        },

        close() {
          if (!isOpen.value) return;

          isOpen.value = false;
          emit("closed");
        },

        handleKey(e: KeyboardEvent) {
          switch (e.key) {
            case "Escape":
              this.close();
              e.stopPropagation();
              break;

            case "ArrowRight":
              const item = (e.target as HTMLElement).querySelector<HTMLElement>(
                ".item-active.menu-group",
              );
              item?.click();
              e.stopPropagation();
              break;

            case "ArrowLeft":
              if ((e.target as HTMLElement).closest(".menu-group")) {
                this.close();
                e.stopPropagation();
              }
              break;

            default:
              this.keys.onKeydown(e);
          }
        },
      });

      return state;
    },
  });
</script>
