import { useEffect } from 'react';
import { autorelease, effect } from 'rxstatejs';

export function useAutorelease (cb: () => void) {
  useEffect(() => {
    const ar = autorelease(() => {
      effect(cb);
    });
    return () => ar.unsubscribe();
  }, []);
}