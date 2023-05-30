import { Subject } from 'rxjs';
import { trackEffect } from './effect.js';
import { REACTIVE_FLAG, REACTIVE_PUBLISHER } from './types.js';

export type ReadonlyReactiveValue<T> = Readonly<ReactiveValue<T>>

export type ReactiveValue<T> = {
  current: T
  [REACTIVE_FLAG]: number

  /**
   * @deprecated test only
   */
  [REACTIVE_PUBLISHER]: Subject<any>
}

export function reactiveValue<T> (value: T): ReactiveValue<T> {
  const subject = new Subject<[current: T, previous: T]>();

  return {
    [REACTIVE_FLAG]: 0,
    [REACTIVE_PUBLISHER]: subject,
    get current () {
      trackEffect(this[REACTIVE_FLAG], subject);
      return value;
    },
    set current (newValue: T) {
      if (value !== newValue) {
        const previous = value;
        value = newValue;
        subject.next([newValue, previous]);
      }
    },
  };
}
