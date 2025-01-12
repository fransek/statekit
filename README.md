<div align="center">
  <img src="./demo/src/statekit-logo.svg" alt="Statekit logo" width="128" />
  <h1 align="center">
    Statekit
  </h1>
  <a href="https://npmjs.com/package/@fransek/statekit">
    <img src="https://img.shields.io/npm/v/@fransek/statekit" alt="License" />
  </a>
  <a href="https://npmjs.com/package/@fransek/statekit">
    <img src="https://img.shields.io/npm/dm/@fransek/statekit" alt="Downloads" />
  </a>
  <a href="https://bundlephobia.com/package/@fransek/statekit">
    <img src="https://img.shields.io/bundlephobia/minzip/@fransek/statekit" alt="Minzipped size" />
  </a>
</div>

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

[Read the API docs.](https://fransek.github.io/statekit/modules.html)
