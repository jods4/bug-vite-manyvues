import { getFrameData } from "framesync";
import { velocityPerSecond } from "popmotion";

export class MotionValue {
  protected previous = 0;
  protected timeDelta = 0;

  constructor(protected value: number, protected update: (v: number) => void) {}

  set = (current: number) => {
    this.previous = this.value;
    this.value = current;
    if (this.previous !== current) this.update.call(null, current);
    this.timeDelta = getFrameData().delta;
  };

  get velocity() {
    return velocityPerSecond(this.value - this.previous!, this.timeDelta);
  }
}
