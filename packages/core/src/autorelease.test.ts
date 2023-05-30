import { describe, expect } from '@jest/globals';
import { addAutorelease, autorelease } from './autorelease.js';

describe('autorelease.ts', () => {
  it('release', () => {
    let t = false;
    let p = false;
    autorelease(() => {
      autorelease(() => {
        addAutorelease(() => {
          t = true;
        });
      });
      addAutorelease(() => {
        p = true;
      });
    }).unsubscribe();

    expect(t).toBeTruthy();
    expect(p).toBeTruthy();
  });
});