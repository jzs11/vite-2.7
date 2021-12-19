import { useDebounceFn } from '@vueuse/core';
import { Ref } from 'vue';
import { EventEmitter } from './EventsEmitter';

export class EasingFunctions {
  // no easing, no acceleration
  static linear = (t: number) => t;

  // accelerating from zero velocity
  static easeInQua = (t: number) => t * t;

  // decelerating to zero velocity
  static easeOutQuad = (t: number) => t * (2 - t);

  // acceleration until halfway, then deceleration
  static easeInOutQuad = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

  // accelerating from zero velocity
  static easeInCubic = (t: number) => t * t * t;

  // decelerating to zero velocity
  static easeOutCubic = (t: number) => --t * t * t + 1;

  // acceleration until halfway, then deceleration
  static utCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1);

  // accelerating from zero velocity
  static easeInQuart = (t: number) => t * t * t * t;

  // decelerating to zero velocity
  static easeOutQuart = (t: number) => 1 - --t * t * t * t;

  // acceleration until halfway, then deceleration
  static easeInOutQuart = (t: number) => (t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t);

  // accelerating from zero velocity
  static easeInQuint = (t: number) => t * t * t * t * t;

  // decelerating to zero velocity
  static easeOutQuint = (t: number) => 1 + --t * t * t * t * t;

  // acceleration until halfway, then deceleration
  static easeInOutQuint = (t: number) => (t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t);
}

export class Animator extends EventEmitter {
  constructor() {
    super();
  }

  doIt = (from: number, to: number, seconds: number, easeFunction: (t: number) => number) => {
    const start = Date.now();

    while (true) {
      const now = Date.now();
      const duration = seconds * 1000;
      const progress = (now - start) / duration;
      if (now - start >= duration) {
        this.fire('changes', to);
        break;
      } else {
        const result = easeFunction(progress) * (to - from);
        // const result = this.doItInner(progress, to - from, easeFunction)();
        // this.target.value = result;
        // console.log(result);
        // console.log(`${result} 💍 `);
        this.fire('changes', result);
      }
    }
  };

  doItInner = (progress: number, range: number, easeFunction: (t: number) => number) =>
    useDebounceFn(() => easeFunction(progress) * range, 10);
}
