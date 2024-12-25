import { useSyncExternalStore } from "react";
import { StateModifier, Store } from "./createStore";

export type BoundStore<
  TState extends object,
  TActions extends object,
  TSelection = TState,
> = {
  state: TSelection;
  actions: TActions;
  set: (stateModifier: StateModifier<TState>) => TState;
};

/**
 * A hook used to access a store created with `createStore` and bind it to a component.
 *
 * @param {Store<TState, TActions>} store - The store created with `createStore`.
 * @returns {BoundStore<TState, TActions>} An object containing the current state, actions, and set function.
 *
 * @example
 * import { useStore } from "@fransek/statekit";
 * import { store } from "./store";
 *
 * function Counter() {
 *   const {
 *     state: { count },
 *     actions: { increment, decrement, reset },
 *   } = useStore(store);
 *
 *   return (
 *     <div>
 *       <div>{count}</div>
 *       <button onClick={decrement}>-</button>
 *       <button onClick={increment}>+</button>
 *       <button onClick={reset}>Reset</button>
 *     </div>
 *   );
 * }
 */
export const useStore = <
  TState extends object,
  TActions extends object,
  TSelection = TState,
>(
  { get, set, subscribe, actions }: Store<TState, TActions>,
  select?: (state: TState) => TSelection,
): BoundStore<TState, TActions, TSelection> => {
  const getState = () => (select ? select(get()) : get());
  const state = useSyncExternalStore(
    subscribe,
    getState,
    getState,
  ) as TSelection;
  return { state, actions, set };
};
