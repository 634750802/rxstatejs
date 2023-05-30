import { Subscription, TeardownLogic } from 'rxjs';

let __autoreleaseSubscription: Subscription | undefined = undefined;

export function autorelease (cb: () => void) {
  const parent = __autoreleaseSubscription;
  const current = __autoreleaseSubscription = new Subscription();
  parent?.add(current);
  cb();
  __autoreleaseSubscription = parent;
  return current;
}

/**
 * @internal
 */
export function addAutorelease (teardown: TeardownLogic) {
  __autoreleaseSubscription?.add(teardown);
}