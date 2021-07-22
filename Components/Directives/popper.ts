import { Directive } from "vue";
import { createPopper, Placement, Modifier } from "@popperjs/core";

export interface VirtualElement {
  getBoundingClientRect(): {
    left: number;
    top: number;
    right: number;
    bottom: number;
    width: number;
    height: number;
  };
}

export interface PopperOptions {
  anchor: Element | VirtualElement;
  placement?: Placement;
  offset?: [number, number];
  sameWidth?: boolean;
}

export const popper: Directive = {
  mounted(
    el,
    {
      value: { anchor, placement = "bottom", offset, sameWidth },
    }: { value: PopperOptions },
  ) {
    const modifiers = [] as Partial<Modifier<string, any>>[];
    if (offset) modifiers.push({ name: "offset", options: { offset } });
    if (sameWidth) modifiers.push(sameWidthModifier);

    el["$popper"] = createPopper(anchor, el, {
      placement,
      modifiers,
      strategy: "fixed",
    });
  },

  beforeUnmount(el, _, vnode) {
    const instance = el["$popper"] as ReturnType<typeof createPopper>;
    if (vnode.transition)
      vnode.transition.afterLeave = () => instance.destroy();
    else instance.destroy();
  },
};

// Modifier that makes the popper the same width as its reference element. Nice for dropdowns.
const sameWidthModifier: Modifier<"sameWidth", {}> = {
  name: "sameWidth",
  enabled: true,
  phase: "beforeWrite",
  requires: ["computeStyles"],

  fn({ state }) {
    state.styles.popper.width = state.rects.reference.width + "px";
  },

  effect({ state }) {
    state.elements.popper.style.width =
      (state.elements.reference as HTMLElement).offsetWidth + "px";
  },
};
