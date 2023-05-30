import { describe, expect, jest } from '@jest/globals';
import { autorelease } from './autorelease.js';
import { effect } from './effect.js';
import { watch } from './operators.js';
import { reactiveObject } from './reactive-object.js';
import { REACTIVE_FLAG, REACTIVE_FLAG_INACTIVE } from './types.js';
import { inactiveScope } from './utils.js';

describe('reactive-object.ts', () => {
  it('wait', async () => {
    const o: {
      foo: string,
      bar?: string
    } = {
      foo: '0',
    };

    const ro = reactiveObject(o);
  });

  it('effect', () => {
    const o: { foo?: number } = { foo: 1 };
    let curr: number | undefined = 1;
    const ro = reactiveObject(o);

    const fn = jest.fn();

    effect(() => {
      expect(ro.foo).toBe(curr);
      fn();
    });

    curr = 2;
    ro.foo = 2;

    curr = 3;
    ro.foo = 3;

    curr = 4;
    ro.foo = 4;

    curr = undefined;
    delete ro.foo;

    // not called for already deleted
    curr = NaN;
    delete ro.foo;

    curr = 5;
    ro.foo = 5;

    // not called for already deleted
    curr = NaN
    ro.foo = 5;

    expect(fn).toBeCalledTimes(6);
  });

  it('watch', () => {
    const o: { foo: number } = { foo: 1 };
    const ro = reactiveObject(o);

    const computed = watch(() => {
      return ro.foo + 1;
    });

    expect(computed.current).toBe(ro.foo + 1);
    ro.foo += 10;
    expect(computed.current).toBe(ro.foo + 1);
  });

  it('autorelease', () => {
    let subscribed = true;
    const sub = autorelease(() => {
      effect((addTeardownLogic) => {
        addTeardownLogic(() => {
          subscribed = false;
        });
      });
    });
    sub.unsubscribe();

    expect(subscribed).toBeFalsy();
  });

  it('inactive', () => {
    const o: { foo: number } = { foo: 1 };
    const ro = reactiveObject(o);

    effect(() => {
      expect(ro.foo % 2).toBe(1);
    });

    inactiveScope(ro, () => {
      ro.foo = 2;

      expect(ro[REACTIVE_FLAG] & REACTIVE_FLAG_INACTIVE).toBe(REACTIVE_FLAG_INACTIVE);
      inactiveScope(ro, () => {
        expect(ro[REACTIVE_FLAG] & REACTIVE_FLAG_INACTIVE).toBe(REACTIVE_FLAG_INACTIVE);
      });
      expect(ro[REACTIVE_FLAG] & REACTIVE_FLAG_INACTIVE).toBe(REACTIVE_FLAG_INACTIVE);
    });
    ro.foo = 3;
  });
});