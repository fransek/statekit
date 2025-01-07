import {
  createStore,
  createStoreContext,
  useStore,
  useStoreContext,
} from "@fransek/statekit";
import { useMemo } from "react";

// Create the store context
const CounterStoreContext = createStoreContext((initialCount: number) =>
  createStore(
    { count: initialCount },
    (set) => ({
      increment: () => set((state) => ({ count: state.count + 1 })),
      decrement: () => set((state) => ({ count: state.count - 1 })),
      reset: () => set({ count: initialCount }),
    }),
    { resetOnDetach: true },
  ),
);

export const Counter = ({ initialCount }: { initialCount: number }) => {
  // Create an instance of the store. Make sure the store is not instantiated on every render.
  const store = useMemo(
    () => CounterStoreContext.instantiate(initialCount),
    [initialCount],
  );
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

export const Context = () => (
  <>
    <div
      className="flex flex-col gap-4 border p-4 rounded items-start"
      id="todo"
    >
      <h2 className="font-bold">Counter 1</h2>
      <Counter initialCount={0} />
    </div>
    <div
      className="flex flex-col gap-4 border p-4 rounded items-start"
      id="todo"
    >
      <h2 className="font-bold">Counter 2</h2>
      <Counter initialCount={10} />
    </div>
  </>
);
