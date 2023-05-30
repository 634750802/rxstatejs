import { Observer, Subject, Subscribable, Subscriber, Subscription, TeardownLogic, Unsubscribable } from 'rxjs';
import { addAutorelease } from './autorelease.js';
import { isInactive } from './utils.js';

class Effect extends Subscriber<any> implements Observer<any> {

  constructor (readonly parent: Effect | undefined, destination: Subscriber<any> | Observer<any>) {
    super(destination);
    parent?.add(this);
  }
}

let __effect: Effect | undefined;

type EffectCallback = (addTeardownLogic: (teardown: TeardownLogic) => void) => void

export function effect (cb: EffectCallback): Unsubscribable {
  const dest = new Subject<void>();
  const subscription = new Subscription();

  let lastEffect = callWithEffect(cb, dest, subscription);
  addAutorelease(dest);
  addAutorelease(() => lastEffect.unsubscribe());

  dest.subscribe(() => {
    subscription.remove(lastEffect);
    lastEffect.unsubscribe();
    lastEffect = callWithEffect(cb, dest, subscription);
    subscription.add(lastEffect);
  });

  subscription.add(dest);
  subscription.add(lastEffect);

  addAutorelease(subscription);

  return subscription;
}

function callWithEffect<T> (cb: EffectCallback, dest: Subject<T>, subscription: Subscription) {
  const parentEffect = __effect;

  const curr = __effect = new Effect(parentEffect, dest);
  parentEffect?.add(curr);

  cb(teardown => subscription.add(teardown));

  __effect = parentEffect;
  return curr;
}

/**
 * @deprecated Test only
 */
export function currentEffect () {
  return __effect;
}

export function trackEffect (flag: number, subscribable: Subscribable<any>) {
  if (!isInactive(flag)) {
    if (__effect) {
      addAutorelease(subscribable.subscribe(__effect));
    }
  }
}
