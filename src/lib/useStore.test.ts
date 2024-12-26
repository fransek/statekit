import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { createStore } from "./createStore";
import { useStore } from "./useStore";

describe("useStore", () => {
  const store = createStore({ count: 0 }, (set) => ({
    increment: () => set((state) => ({ count: state.count + 1 })),
    decrement: () => set((state) => ({ count: state.count - 1 })),
    reset: () => set({ count: 0 }),
  }));

  afterEach(() => {
    store.actions.reset();
  });

  it("should return the initial state and actions", () => {
    const { result } = renderHook(() => useStore(store));

    expect(result.current).toStrictEqual({
      state: { count: 0 },
      actions: {
        increment: expect.any(Function),
        decrement: expect.any(Function),
        reset: expect.any(Function),
      },
      set: expect.any(Function),
    });
  });

  it("should call the set function with the state modifier", () => {
    const { result } = renderHook(() => useStore(store));

    act(() => {
      result.current.set((state) => ({ count: state.count + 1 }));
    });

    expect(result.current.state).toStrictEqual({ count: 1 });
  });

  it("should call the action functions", () => {
    const { result } = renderHook(() => useStore(store));

    act(() => {
      result.current.actions.increment();
    });

    expect(result.current.state).toStrictEqual({ count: 1 });
  });

  it("should return the selected state", () => {
    const { result } = renderHook(() =>
      useStore(store, (state) => state.count),
    );
    expect(result.current.state).toStrictEqual(0);

    act(() => {
      result.current.actions.increment();
    });

    expect(result.current.state).toStrictEqual(1);
  });
});
