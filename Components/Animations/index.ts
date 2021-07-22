import { AnimationOptions, animate } from "popmotion";
import styler from "stylefire";
import { parallel, stagger } from "./combinators";

export { MotionValue } from "./motion-value";

type Motion = AnimationOptions<any> & {
  prop?: string;
};

export type Motions = Motion | Array<Motion>;

export function motion(
  motions: Motions,
  targets: HTMLElement | HTMLElement[],
  staggered: true | number = 0,
) {
  if (Array.isArray(targets)) {
    if (targets.length == 0) return Promise.resolve();

    if (targets.length > 1) {
      const animations = targets.map(t => () => applyMotion(motions, t));
      return stagger(animations, staggered);
    }

    targets = targets[0];
  }
  return applyMotion(motions, targets);
}

function applyMotion(motions: Motions, target: HTMLElement): Promise<unknown> {
  if (Array.isArray(motions)) {
    return parallel(motions.map(m => () => applyMotion(m, target)));
  }

  return new Promise<void>(resolve => {
    const style = styler(target);

    const onUpdate =
      "prop" in motions
        ? (v: number) => style.set(motions.prop!, v)
        : style.set;

    animate<any>({
      ...motions,
      onUpdate,
      onComplete: resolve,
    });
  });
}
