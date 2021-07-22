import { shallowReactive as sref, h, VNode, defineComponent } from "vue";
import { remove } from "@/System/array";
import { emit, listen } from "@/System/event-bus";

let id = 0;

export type MountComponent = (
  comp: any, // FIXME
  props: object,
  children?: any,
) => () => void;

export type MountTarget = {
  comp: Parameters<typeof h>[0];
  props?: Parameters<typeof h>[1];
  children?: Parameters<typeof h>[2];
};

// This is where all tooltips, dropdowns, popups, dialogs, etc. live
export default defineComponent({
  setup(_, { slots }) {
    const adorners = sref([] as VNode[]);

    listen<MountTarget>("mount", ({ comp, props, children }) => {
      const adorner = h(comp, { ...props, key: ++id + "" }, children);
      adorners.push(adorner);
      return () => remove(adorners, adorner);
    });

    return () => [slots.default!(), ...adorners];
  },
});

export function mount(
  comp: any,
  props?: MountTarget["props"],
  children?: MountTarget["children"],
) {
  return emit("mount", { comp, props, children }) as () => void;
}
