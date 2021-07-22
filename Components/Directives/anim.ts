import { easeIn, easeOut } from "popmotion";
import { Directive, VNode } from "vue";
import { motion, Motions } from "@/Components/Animations";

export interface AnimOptions {
  target?: string; // Selector if not itself
  enter?: keyof typeof enterAnimations;
  leave?: keyof typeof leaveAnimations;
  afterLeave?: () => void;
  staggered?: true | number;
}

export const anim: Directive<HTMLElement> = {
  mounted(
    el,
    { value: { target, enter, staggered = 0 } }: { value: AnimOptions },
  ) {
    if (enter) {
      const targets = target
        ? Array.from(el.querySelectorAll<HTMLElement>(target))
        : [el];
      // Avoid flickering as the first animation frame is not sync
      targets.forEach(t => (t.style.opacity = "0"));
      motion(enterAnimations[enter], targets, staggered);
    }
  },

  beforeUnmount(
    _el,
    { value: { target, leave, afterLeave } }: { value: AnimOptions },
    vnode,
  ) {
    if (!leave) return;

    vnode.transition = {
      mode: undefined,
      persisted: false,
      beforeEnter() {},
      enter() {},
      clone(_: VNode) {
        return { ...this };
      },

      leave(el: HTMLElement, remove) {
        if (target) el = el.querySelector<HTMLElement>(target)!;
        el.style.pointerEvents = "none";
        el.classList.add("anim-leaving");
        motion(leaveAnimations[leave], el).then(() => {
          remove();
          afterLeave?.();
        });
      },
    };
  },
};

// Note: Since popmotion 9.0, if a spring animation type is used
// (auto-detected when stiffness or damping is indicated)
// then from/to can only be a plain number, not an object.
const enterAnimations: Record<string, Motions> = {
  floatRight: {
    from: { opacity: 0, x: -10 },
    to: { opacity: 1, x: 0 },
    ease: easeOut,
    duration: 160,
  },

  floatUp: {
    from: { opacity: 0, y: 10 },
    to: { opacity: 1, y: 0 },
    ease: easeOut,
    duration: 160,
  },

  // TODO: linked animations?
  popUp: [
    {
      prop: "y",
      from: 8,
      to: 0,
      stiffness: 360,
      damping: 10,
    },
    {
      prop: "scaleX",
      from: 0.9,
      to: 1,
      stiffness: 360,
      damping: 16,
    },
    {
      prop: "opacity",
      from: 0,
      to: 1,
      duration: 200,
    },
  ],

  zoomIn: [
    {
      prop: "opacity",
      from: 0,
      to: 1,
      duration: 200,
    },
    {
      prop: "scale",
      from: 0.9,
      to: 1,
      duration: 200,
      stiffness: 50,
    },
  ],
};

const leaveAnimations = {
  fadeOut: {
    prop: "opacity",
    from: 1,
    to: 0,
    duration: 100,
  },

  floatLeft: {
    from: { opacity: 1, x: 0 },
    to: { opacity: 0, x: -10 },
    ease: easeIn,
    duration: 160,
  },

  floatUp: {
    from: { opacity: 1, y: 0 },
    to: { opacity: 0, y: -10 },
    ease: easeIn,
    duration: 160,
  },

  bounceUp: [
    {
      prop: "y",
      from: 0,
      to: -20,
      velocity: 200,
      stiffness: 200,
      damping: 18,
    },
    {
      prop: "opacity",
      from: 1,
      to: 0,
      duration: 200,
    },
  ],

  zoomOut: [
    {
      prop: "opacity",
      from: 1,
      to: 0,
      duration: 200,
    },
    {
      prop: "scale",
      from: 1,
      to: 0.9,
      duration: 200,
      stiffness: 50,
    },
  ],
};
