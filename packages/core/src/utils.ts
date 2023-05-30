import { AnyReactive, REACTIVE_FLAG, REACTIVE_FLAG_INACTIVE } from './types.js';

/**
 * @internal
 */
export function isInactive (flag: number) {
  return (flag & REACTIVE_FLAG_INACTIVE) !== 0;
}

export function inactiveScope<T extends AnyReactive, R> (val: T, cb: () => R) {
  const flag = val[REACTIVE_FLAG];
  if (isInactive(flag)) {
    return cb();
  }

  val[REACTIVE_FLAG] |= REACTIVE_FLAG_INACTIVE;
  const res = cb();
  val[REACTIVE_FLAG] &= ~0xffffffff;

  return res;
}
