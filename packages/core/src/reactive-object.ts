import { Subject } from 'rxjs';
import { trackEffect } from './effect.js';
import { AnyReactive, BindingTypeEvent, MutationEvent, REACTIVE_FLAG, REACTIVE_FLAG_OBJECT, REACTIVE_PUBLISHER } from './types.js';
import { isInactive } from './utils.js';

type ReactiveObject<T> = T & AnyReactive

export function reactiveObject<T extends Record<string, any>> (object: T): ReactiveObject<T> {
  type Key = Extract<keyof T, string>;
  const eventBus = new Subject<MutationEvent<Key, T[Key]>>();
  let flag = REACTIVE_FLAG_OBJECT;

  return new Proxy<ReactiveObject<T>>(object as ReactiveObject<T>, {
    get (target: T, p: string | symbol, receiver: any): any {
      if (p === REACTIVE_FLAG) {
        return flag;
      }
      if (p === REACTIVE_PUBLISHER) {
        return eventBus;
      }
      trackEffect(flag, eventBus);
      return target[p as keyof T];
    },

    set (target: T, p: string | symbol, value, receiver: any): boolean {
      if (p === REACTIVE_FLAG) {
        flag = value;
        return true;
      }
      if (isInactive(flag)) {
        target[p as keyof T] = value;
        return true;
      }

      if (p in target) {
        const prev = target[p as keyof T];
        target[p as keyof T] = value;
        if (prev !== value) {
          eventBus.next([BindingTypeEvent.UPDATED, p as any, value, prev]);
        }
      } else {
        target[p as keyof T] = value;
        eventBus.next([BindingTypeEvent.CREATED, p as any, value]);
      }
      return true;
    },

    deleteProperty (target: ReactiveObject<T>, p: string | symbol): boolean {
      if (p in target) {
        const prev = target[p as keyof T];
        delete target[p as keyof T];
        eventBus.next([BindingTypeEvent.DELETED, p as any, undefined, prev]);
      }
      return true;
    },

  });
}
