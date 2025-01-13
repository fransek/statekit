import { act, renderHook } from "@testing-library/react";
import React, { useRef } from "react";
import { describe, expect, it } from "vitest";
import { createStore } from "../core/createStore";
import { createStoreContext } from "../utils/createStoreContext";
import { useStoreContext } from "./useStoreContext";

describe("useStoreContext", () => {
  const StoreContext = createStoreContext((initialCount: number) =>
    createStore({ count: initialCount }, (set) => ({
      increment: () => set((state) => ({ count: state.count + 1 })),
      decrement: () => set((state) => ({ count: state.count - 1 })),
      reset: () => set({ count: 0 }),
    })),
  );

  const renderUseStoreContext = <T,>(
    select?: (state: { count: number }) => T,
  ) =>
    renderHook(() => useStoreContext(StoreContext, select), {
      wrapper: ({ children }) => {
        const store = useRef(StoreContext.instantiate(0)).current;
        return (
          <StoreContext.Provider value={store}>
            {children}
          </StoreContext.Provider>
        );
      },
    });

  it("should throw an error if the store context is not found", () => {
    expect(() => renderHook(() => useStoreContext(StoreContext))).toThrowError(
      "Store context not found. Make sure you are using the store context within a provider.",
    );
  });

  it("should return the initial state and actions", () => {
    const { result } = renderUseStoreContext();
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

  it("should return the selected state", () => {
    const { result } = renderUseStoreContext((state) => state.count);
    expect(result.current.state).toStrictEqual(0);

    act(() => {
      result.current.actions.increment();
    });

    expect(result.current.state).toStrictEqual(1);
  });
});
