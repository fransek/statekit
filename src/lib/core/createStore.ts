import { merge } from "../utils/merge";

export type Store<TState extends object, TActions extends object> = {
  /** Returns the current state of the store. */
  get: () => TState;
  /** Sets the state of the store. */
  set: (stateModifier: StateModifier<TState>) => TState;
  /** Subscribes to changes in the state of the store. Returns an unsubscribe function. */
  subscribe: (listener: Listener) => Listener;
  /** Actions that can modify the state of the store. */
  actions: TActions;
  /** Adds an event listener to the store. */
  addEventListener: (
    event: StoreEvent,
    listener: StoreListener<TState>,
  ) => void;
  /** Removes an event listener from the store. */
  removeEventListener: (
    event: StoreEvent,
    listener: StoreListener<TState>,
  ) => void;
};

type Listener = () => void;

export type StoreEvent = "attach" | "detach" | "change" | "load";

export type StoreListener<TState extends object> = (
  state: TState,
  set: SetState<TState>,
) => void;

export type SetState<TState extends object> = (
  stateModifier: StateModifier<TState>,
) => TState;

export type GetState<TState extends object> = () => TState;

export type StateModifier<TState extends object> =
  | Partial<TState>
  | ((state: TState) => Partial<TState>);

export type DefineActions<TState extends object, TActions> = (
  set: (stateModifier: StateModifier<TState>) => TState,
  get: () => TState,
) => TActions;

export type StoreOptions<TState extends object> = {
  /** Invoked when the store is created. */
  onLoad?: StoreListener<TState>;
  /** Invoked when the store is subscribed to. */
  onAttach?: StoreListener<TState>;
  /** Invoked when the store is unsubscribed from. */
  onDetach?: StoreListener<TState>;
  /** Invoked whenever the state changes. */
  onStateChange?: StoreListener<TState>;
  /** Whether to reset the state to the initial state when the store is detached. */
  resetOnDetach?: boolean;
};

/**
 * Creates a store with an initial state and actions that can modify the state.
 *
 * @param {TState} initialState - The initial state of the store.
 * @param {DefineActions<TState, TActions> | null} [defineActions=null] - A function that defines actions that can modify the state.
 * @param {StoreOptions<TState>} [options] - Additional options for the store.
 *
 * @returns {Store<TState, TActions>} The created store with state management methods.
 *
 * @example
 * ```ts
 * import { createStore } from "@fransek/statekit";
 *
 * const store = createStore({ count: 0 }, (set) => ({
 *   increment: () => set((state) => ({ count: state.count + 1 })),
 *   decrement: () => set((state) => ({ count: state.count - 1 })),
 *   reset: () => set({ count: 0 }),
 * }));
 * ```
 * @group Core
 */
export const createStore = <
  TState extends object,
  TActions extends object = Record<never, never>,
>(
  initialState: TState,
  defineActions: DefineActions<TState, TActions> | null = null,
  {
    onLoad,
    onAttach,
    onDetach,
    onStateChange,
    resetOnDetach = false,
  }: StoreOptions<TState> = {},
): Store<TState, TActions> => {
  let state = initialState;
  const listeners = new Set<Listener>();

  const eventListeners: Record<StoreEvent, Set<StoreListener<TState>>> = {
    load: new Set(onLoad ? [onLoad] : []),
    attach: new Set(onAttach ? [onAttach] : []),
    detach: new Set(onDetach ? [onDetach] : []),
    change: new Set(onStateChange ? [onStateChange] : []),
  };

  const addEventListener = (
    event: StoreEvent,
    listener: StoreListener<TState>,
  ) => {
    eventListeners[event].add(listener);
  };

  const removeEventListener = (
    event: StoreEvent,
    listener: StoreListener<TState>,
  ) => {
    eventListeners[event].delete(listener);
  };

  const dispatchEvent = (event: StoreEvent, silent = false) => {
    eventListeners[event].forEach((listener) =>
      listener(state, silent ? setSilently : set),
    );
  };

  const get = () => state;

  const setSilently = (stateModifier: StateModifier<TState>) => {
    state = merge(state, stateModifier);
    return state;
  };

  const dispatch = () => {
    dispatchEvent("change", true);
    listeners.forEach((listener) => listener());
  };

  const set = (stateModifier: StateModifier<TState>) => {
    setSilently(stateModifier);
    dispatch();
    return state;
  };

  const subscribe = (listener: Listener) => {
    if (listeners.size === 0) {
      dispatchEvent("attach");
    }

    listeners.add(listener);

    return () => {
      listeners.delete(listener);

      if (listeners.size === 0) {
        dispatchEvent("detach");

        if (resetOnDetach) {
          state = initialState;
          dispatch();
        }
      }
    };
  };

  const actions = defineActions ? defineActions(set, get) : ({} as TActions);

  dispatchEvent("load");

  return {
    get,
    set,
    subscribe,
    actions,
    addEventListener,
    removeEventListener,
  };
};
