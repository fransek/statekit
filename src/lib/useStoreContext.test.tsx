import { renderHook } from "@testing-library/react";
import React, { useRef } from "react";
import { describe, expect, it } from "vitest";
import { createStore } from "./createStore";
import { createStoreContext } from "./createStoreContext";
import { useStoreContext } from "./useStoreContext";

describe("useStoreContext", () => {
  const StoreContext = createStoreContext((initialCount: number) =>
    createStore({ count: initialCount }, (set) => ({
      increment: () => set((state) => ({ count: state.count + 1 })),
      decrement: () => set((state) => ({ count: state.count - 1 })),
      reset: () => set({ count: 0 }),
    })),
  );

  const renderUseStoreContext = () =>
    renderHook(() => useStoreContext(StoreContext), {
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
});
