import { delay } from "./utils";

export function stagger(
  callbacks: (() => Promise<unknown>)[],
  staggered: true | number,
): Promise<unknown> {
  const delta = staggered === true ? 250 / callbacks.length : staggered;

  let delayTime = 0;
  return Promise.all(
    callbacks.map(cb => {
      const result = delayTime === 0 ? cb() : delay(delayTime).then(cb);
      delayTime += delta;
      return result;
    }),
  );
}

export function parallel(callbacks: (() => Promise<unknown>)[]) {
  return stagger(callbacks, 0);
}
