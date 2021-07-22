import {
  Comment,
  defineComponent,
  Fragment,
  onUpdated,
  PropType,
  VNode,
  VNodeTypes,
} from "vue";

export interface KeyboardSelectionApi {
  onKeydown(e: KeyboardEvent, stop?: boolean): boolean;
  clear(): void;
}

export default defineComponent({
  props: {
    itemType: [Object, Function] as PropType<VNodeTypes>,
    submitKeys: {
      type: [String, Array] as PropType<string | string[]>,
      default: () => ["Enter"],
    },
  },

  emits: {
    api: (_: KeyboardSelectionApi) => true,
  },

  setup(props, { emit, slots }) {
    let items: VNode<HTMLElement>[] = [];
    let activeIndex = -1;
    let active: HTMLElement | null = null;

    // HACK: we manipulate the class directly on HTML elements as it's both simpler and more efficient
    function updateItems(scroll = false) {
      const newActive = items[activeIndex]?.el;
      // Do nothing if the active element is the same.
      // Note this is more efficient than comparing vnodes, as a render can produce different vnode instances
      // for the same element when run again.
      if (newActive === active) return;
      active?.classList.remove("item-active");
      active = newActive;
      active?.classList.add("item-active");
      if (scroll)
        active?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    onUpdated(updateItems);

    function onKeydown(e: KeyboardEvent, stop = true) {
      const { submitKeys } = props;
      if (
        e.key === submitKeys ||
        (Array.isArray(submitKeys) && submitKeys.includes(e.key))
      ) {
        const el = active ?? (items.length == 1 ? items[0].el : null);
        el?.click();
        if (stop) {
          e.stopPropagation();
          e.preventDefault();
        }
        return true;
      }

      // Ease handling of "up" cases
      if (items.length === 0) return false;

      switch (e.key) {
        case "ArrowDown":
          activeIndex = Math.min(activeIndex + 1, items.length - 1);
          break;
        case "ArrowUp":
          activeIndex = Math.max(activeIndex - 1, 0);
          break;

        case "PageDown":
          activeIndex = Math.min(activeIndex + 10, items.length - 1);
          break;
        case "PageUp":
          activeIndex = Math.max(activeIndex - 10, 0);
          break;

        default:
          return false;
      }

      updateItems(true);
      if (stop) {
        e.stopPropagation();
        e.preventDefault();
      }
      return true;
    }

    emit("api", {
      onKeydown,
      clear() {
        activeIndex = -1;
        updateItems();
      },
    });

    return () => {
      const { itemType } = props;
      const children = slots.default!() as VNode<HTMLElement>[];

      function deepFlatMap(nodes: VNode<HTMLElement>[]): VNode<HTMLElement>[] {
        return nodes.flatMap(n => {
          if (n.type === Fragment)
            return deepFlatMap(n.children as VNode<HTMLElement>[]);
          if (n.type === Comment) return [];
          if (itemType && n.type !== itemType) return [];
          return n;
        });
      }

      items = deepFlatMap(children);

      if (activeIndex >= items.length) activeIndex = items.length - 1;

      return children;
    };
  },
});
