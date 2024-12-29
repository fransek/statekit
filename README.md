# Statekit

[![Version](https://img.shields.io/npm/v/@fransek/statekit)](https://npmjs.com/package/@fransek/statekit)
[![Downloads](https://img.shields.io/npm/dm/@fransek/statekit.svg)](https://npmjs.com/package/@fransek/statekit)
[![Minzipped size](https://img.shields.io/bundlephobia/minzip/@fransek/statekit)](https://bundlephobia.com/package/@fransek/statekit)

A tiny state management library for React.

- Simple
- Lightweight
- First-class TypeScript support

## Getting started

1. Install the package:

```sh
npm i @fransek/statekit
```

2. Create a store:

```ts
import { createStore } from "@fransek/statekit";

const store = createStore({ count: 0 }, (set) => ({
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}));
```

3. Use the store:

```tsx
import { useStore } from "@fransek/statekit";
import { store } from "./store";

function Counter() {
  const {
    state: { count },
    actions: { increment, decrement, reset },
  } = useStore(store);

  return (
    <div>
      <div>{count}</div>
      <button onClick={decrement}>-</button>
      <button onClick={increment}>+</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
```
