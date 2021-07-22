import { Directive } from "vue";

// NOTE: html standard autofocus attribute only works on first page load and inside <dialog> elements

const inputs = "input,textarea,select,button,[tabindex]";

export default <Directive<HTMLElement>>{
  mounted(el, binding) {
    if (binding.value === false) return;
    // Because of how we wrap some primitive controls into decorators (e.g. textboxes),
    // the actual focusable element might be a child of the element v-autofocus is added to.
    (el.matches(inputs) ? el : el.querySelector<HTMLElement>(inputs))?.focus();
  },
};
