import { describe, expect } from '@jest/globals';
import { useEffect } from 'react';
import { act, create, ReactTestRenderer } from 'react-test-renderer';
import { reactiveValue } from 'rxstatejs';
import { REACTIVE_PUBLISHER } from 'rxstatejs/dist/cjs/types.js';
import { useWatch } from './useWatch.js';

describe('useWatch', () => {
  it('works', async () => {
    let reactive = reactiveValue(1);
    let watchFn = jest.fn();
    let initFn = jest.fn();

    function TestComponent () {
      const value = useWatch(() => reactive.current + 1);
      useEffect(() => {
        initFn(value);
      }, []);
      useEffect(() => {
        watchFn(value);
      }, [value]);
      return <>{value}</>;
    }

    let root: ReactTestRenderer = null as never as ReactTestRenderer;
    await act(() => {
      root = create(<TestComponent />);
    });
    // should add observers to reactive value
    expect(reactive[REACTIVE_PUBLISHER].observers.length).toBeGreaterThan(0);

    expect(root.toTree()?.rendered).toBe('2');
    expect(initFn).toBeCalledWith(2);
    expect(watchFn).toBeCalledWith(2);

    await act(() => {
      reactive.current = 3;
      root.update(<TestComponent />);
    });

    // component should be updated with new value
    expect(root.toTree()?.rendered).toBe('4');
    // watch value effect fn should be called
    expect(watchFn).toBeCalledWith(4);

    // Init effect fn should be called once
    expect(initFn).toBeCalledTimes(1);

    await act(() => {
      root.unmount();
    });

    // subscribers cleared after unmount
    expect(reactive[REACTIVE_PUBLISHER].observers.length).toBe(0);
  });

  it('works in SSR', () => {
    let reactive = reactiveValue(1);
    let initFn = jest.fn();

    function TestComponent () {
      const value = useWatch(() => reactive.current + 1);
      useEffect(() => {
        initFn();
      }, []);
      return <>{value}</>;
    }

    let root: ReactTestRenderer = null as never as ReactTestRenderer;
    root = create(<TestComponent />);

    // should render initial value and useEffect not called yet.
    expect(root.toTree()?.rendered).toBe('2');
    expect(initFn).toBeCalledTimes(0);
  });
});