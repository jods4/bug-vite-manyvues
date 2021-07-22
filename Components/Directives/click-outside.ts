import { Directive } from "vue";

const defaultEvents = ["pointerdown", "focusin"];

export type ClickOutsideOptions =
  | (() => void)
  | {
      callback(): void;
      closest?: string;
      scope?: HTMLElement;
      events?: string[];
    };

export const clickOutside: Directive<HTMLElement> = {
  mounted(el, binding: { value: ClickOutsideOptions }) {
    const value =
      typeof binding.value === "function"
        ? { callback: binding.value }
        : binding.value;

    value.events ??= defaultEvents;

    const scope =
      value.scope || (value.closest && el.closest(value.closest)) || el;

    const listener = (e: Event) => {
      if (scope.contains(e.target as Node)) return;
      dispose();
      value.callback();
    };

    function dispose() {
      value.events!.forEach(e => window.removeEventListener(e, listener, true));
    }

    el["$clickOutside"] = dispose;

    value.events.forEach(e =>
      window.addEventListener(e, listener, { capture: true, passive: true }),
    );
  },

  unmounted(el) {
    el["$clickOutside"](); // dispose()
  },
};
