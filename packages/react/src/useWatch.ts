import { useEffect, useState } from 'react';
import { effect, watch } from 'rxstatejs';
import { autorelease } from 'rxstatejs/dist/esm/index.js';
import { useAutorelease } from './useAutorelease.js';

export function useWatch<T> (getEffect: () => T) {
  const [value, setValue] = useState(() => {
    // TODO: prevent effect
    return getEffect();
  });

  useAutorelease(() => {
    const watched = watch(getEffect);
    setValue(watched.current);
  })

  return value;
}
