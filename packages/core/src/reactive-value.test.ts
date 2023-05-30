import { describe, expect } from '@jest/globals';
import { watch } from './operators.js';
import { reactiveValue } from './reactive-value.js';

describe('reactive-value.ts', () => {
  it('reactive', () => {
    const value = reactiveValue(1);

    const computed = watch(() => value.current + 1);
    expect(computed.current).toBe(value.current + 1);

    value.current += 1;
    expect(computed.current).toBe(value.current + 1);
  });
});