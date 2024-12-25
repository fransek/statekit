import { createStore, useStore } from "@fransek/statekit";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/global")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-col gap-4">
      <Counter />
      <Todo />
    </div>
  );
}

const Counter = () => {
  const {
    state: { count },
    actions: { countActions },
  } = useStore(globalStore, (state) => state.countState);

  console.log("Rendering Counter");

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-bold">Counter</h2>
      <div className="flex gap-4 items-center">
        <button onClick={countActions.decrement}>-</button>
        <div aria-label="count">{count}</div>
        <button onClick={countActions.increment}>+</button>
      </div>
    </div>
  );
};

const Todo = () => {
  const {
    state: { input, todos },
    actions: { todoActions },
  } = useStore(globalStore, (state) => state.todoState);

  console.log("Rendering Todo");

  return (
    <div className="flex flex-col gap-4" id="todo">
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
          className="border-2 rounded p-1 mr-2"
        />
        <button type="submit">Add</button>
      </form>
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
    </div>
  );
};

interface CountState {
  count: number;
}

interface TodoState {
  input: string;
  todos: { title: string; complete: boolean }[];
}

interface GlobalState {
  countState: CountState;
  todoState: TodoState;
}

const globalStore = createStore(
  {
    countState: {
      count: 0,
    },
    todoState: {
      input: "",
      todos: [],
    },
  } as GlobalState,
  (set) => ({
    todoActions: {
      setInput: (input: string) =>
        set((state) => ({ todoState: { ...state.todoState, input } })),
      addTodo: () =>
        set((state) => ({
          todoState: {
            todos: [
              ...state.todoState.todos,
              { title: state.todoState.input, complete: false },
            ],
            input: "",
          },
        })),
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
    countActions: {
      increment: () =>
        set((state) => ({ countState: { count: state.countState.count + 1 } })),
      decrement: () =>
        set((state) => ({ countState: { count: state.countState.count - 1 } })),
      reset: () => set({ countState: { count: 0 } }),
    },
  }),
);
