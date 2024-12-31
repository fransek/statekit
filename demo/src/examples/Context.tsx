import {
  createStoreContext,
  createStore,
  useStore,
  useStoreContext,
} from "@fransek/statekit";
import { useRef } from "react";

// Create the store context
const CounterStoreContext = createStoreContext(
  (initialState: { count: number }) =>
    createStore(
      initialState,
      (set) => ({
        increment: () => set((state) => ({ count: state.count + 1 })),
        decrement: () => set((state) => ({ count: state.count - 1 })),
        reset: () => set({ count: 0 }),
      }),
      { resetOnDetach: true },
    ),
);

export const Context = () => {
  // Create an instance of the store. Make sure the store is not instantiated on every render.
  const store = useRef(CounterStoreContext.instantiate({ count: 0 })).current;
  // Use the store
  const {
    state: { count },
    actions: { increment, decrement },
  } = useStore(store);

  return (
    // Provide the store to the context
    <CounterStoreContext.Provider value={store}>
      <div className="grid grid-cols-3 text-center items-center">
        <button onClick={decrement}>-</button>
        <div aria-label="count">{count}</div>
        <button onClick={increment}>+</button>
      </div>
      <ResetButton />
    </CounterStoreContext.Provider>
  );
};

const ResetButton = () => {
  // Access the store from the context
  const {
    actions: { reset },
  } = useStoreContext(CounterStoreContext);

  return <button onClick={reset}>Reset</button>;
};
