import { createStore, useStore } from "@fransek/statekit";

interface CountState {
  count: number;
}

interface TodoState {
  input: string;
  todos: { title: string; complete: boolean }[];
}

interface SharedState {
  countState: CountState;
  todoState: TodoState;
}

const sharedStore = createStore(
  {
    countState: {
      count: 0,
    },

    todoState: {
      input: "",
      todos: [],
    },
  } as SharedState,

  (set, get) => ({
    countActions: {
      increment: () =>
        set((state) => ({ countState: { count: state.countState.count + 1 } })),

      decrement: () =>
        set((state) => ({ countState: { count: state.countState.count - 1 } })),

      reset: () => set({ countState: { count: 0 } }),
    },

    todoActions: {
      setInput: (input: string) =>
        set((state) => ({ todoState: { ...state.todoState, input } })),

      addTodo: () => {
        if (!get().todoState.input) {
          return;
        }

        set((state) => ({
          todoState: {
            todos: [
              ...state.todoState.todos,
              { title: state.todoState.input, complete: false },
            ],
            input: "",
          },
        }));
      },

      toggleTodo: (index: number) =>
        set((state) => ({
          todoState: {
            ...state.todoState,
            todos: state.todoState.todos.map((todo, i) => {
              if (index === i) {
                return { ...todo, complete: !todo.complete };
              }
              return todo;
            }),
          },
        })),
    },
  }),
);

let counterRenderCount = 0;

const Counter = () => {
  const {
    state: { count },
    actions: { countActions },
  } = useStore(sharedStore, (state) => state.countState);

  return (
    <div className="flex flex-col gap-4 border p-4 rounded items-start">
      <h2 className="font-bold">Counter</h2>
      <div className="grid grid-cols-3 text-center items-center">
        <button onClick={countActions.decrement}>-</button>
        <div aria-label="count">{count}</div>
        <button onClick={countActions.increment}>+</button>
      </div>
      <div className="text-sm" data-testid="counterRenderCount">
        Render count: {++counterRenderCount}
      </div>
    </div>
  );
};

let todoRenderCount = 0;

const Todo = () => {
  const {
    state: { input, todos },
    actions: { todoActions },
  } = useStore(sharedStore, (state) => state.todoState);

  return (
    <div
      className="flex flex-col gap-4 border p-4 rounded items-start"
      id="todo"
    >
      <h2 className="font-bold">To do</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          todoActions.addTodo();
        }}
      >
        <input
          aria-label="Add a new todo"
          value={input}
          onChange={(e) => todoActions.setInput(e.target.value)}
          className="mr-2"
        />
        <button type="submit">Add</button>
      </form>
      {todos.length > 0 && (
        <ul>
          {todos.map((todo, index) => (
            <li
              key={todo.title}
              data-testid={`todo-${index}`}
              role="button"
              onClick={() => todoActions.toggleTodo(index)}
              className={`list-disc list-inside ${todo.complete && "line-through"}`}
            >
              {todo.title}
            </li>
          ))}
        </ul>
      )}
      <div className="text-sm" data-testid="todoRenderCount">
        Render count: {++todoRenderCount}
      </div>
    </div>
  );
};

export const Shared = () => {
  return (
    <div className="flex flex-col gap-4 w-fit">
      <Counter />
      <Todo />
    </div>
  );
};
