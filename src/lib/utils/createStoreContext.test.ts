import { describe, it, expect } from "vitest";
import { createStoreContext } from "./createStoreContext";
import { createStore } from "@/core/createStore";

describe("createStoreContext", () => {
  it("should create a store context with an instantiation function", () => {
    const instantiate = (initialCount: number) =>
      createStore({ count: initialCount }, (set) => ({
        increment: () => set((state) => ({ count: state.count + 1 })),
        decrement: () => set((state) => ({ count: state.count - 1 })),
        reset: () => set({ count: 0 }),
      }));

    const StoreContext = createStoreContext(instantiate);

    expect(StoreContext).toHaveProperty("instantiate");
    expect(typeof StoreContext.instantiate).toBe("function");
  });

  it("should instantiate a new store with the given arguments", () => {
    const instantiate = (initialCount: number) =>
      createStore({ count: initialCount }, (set) => ({
        increment: () => set((state) => ({ count: state.count + 1 })),
        decrement: () => set((state) => ({ count: state.count - 1 })),
        reset: () => set({ count: 0 }),
      }));

    const StoreContext = createStoreContext(instantiate);
    const store = StoreContext.instantiate(5);

    expect(store.get()).toEqual({ count: 5 });
    store.actions.increment();
    expect(store.get()).toEqual({ count: 6 });
    store.actions.decrement();
    expect(store.get()).toEqual({ count: 5 });
    store.actions.reset();
    expect(store.get()).toEqual({ count: 0 });
  });
});
