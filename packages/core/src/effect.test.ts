import { describe, expect } from '@jest/globals';
import { currentEffect, effect } from './effect.js';

describe('effect.ts', () => {
  it('nest', () => {

    let child: any;
    const sub = effect(() => {
      const parent = currentEffect();

      expect(parent).toBeTruthy();

      effect(() => {
        child = currentEffect();
        expect(currentEffect()?.parent).toBe(parent);
      });
    });

    sub.unsubscribe();

    expect(child.closed).toBeTruthy();
  });
});