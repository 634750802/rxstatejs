import { effect } from './effect.js';
import { reactiveValue, ReactiveValue } from './reactive-value.js';
import { REACTIVE_PUBLISHER } from './types.js';

export function watch<T extends any> (get: () => T): ReactiveValue<T> {
  const value: ReactiveValue<T> = reactiveValue(get());

  effect((addTeardownLogic) => {
    addTeardownLogic(value[REACTIVE_PUBLISHER]);
    value.current = get();
  });

  return value;
}
