import { createFileRoute } from "@tanstack/react-router";
import { createStore, useStore } from "@fransek/statekit";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

// Create the store
const store = createStore({ count: 0 }, (set) => ({
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}));

function RouteComponent() {
  // Use the store
  const {
    state: { count },
    actions: { increment, decrement },
  } = useStore(store);

  return (
    <div className="grid grid-cols-3 text-center items-center">
      <button onClick={decrement}>-</button>
      <div aria-label="count">{count}</div>
      <button onClick={increment}>+</button>
    </div>
  );
}
