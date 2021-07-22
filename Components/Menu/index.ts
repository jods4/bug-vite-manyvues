import type { Placement } from "@popperjs/core";

export { default as ContextMenu } from "./context-menu.vue";
export { default as MenuSeparator } from "./menu-separator.vue";
export { default as MenuItem } from "./menu-item.vue";

export interface MenuPosition {
  x: number;
  y: number;
}

export interface ContextMenuApi {
  openAt(pos: MenuPosition): void;
  // FIXME: EventTarget | null is a lie but it eases (and fixes) typing inside Vue templates
  //        when doing stuff like openNextTo($event.target)
  openNextTo(
    element: Element | EventTarget | null,
    placement?: Placement,
    offset?: [number, number],
  ): void;
  close(): void;
}
