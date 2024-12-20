import {
  Constraint,
  createFormController,
  useStore,
  Validator,
} from "@fransek/statekit";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/form")({
  component: RouteComponent,
});

const required: Validator<string> = (value) => {
  if (!value) {
    return "Required field";
  }
};

const validateEmail: Validator<string> = (value) => {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return "Invalid email";
  }
};

const maxLength: Constraint<string> = (value) => {
  if (value.length > 10) {
    return false;
  }
  return true;
};

const form = createFormController({
  name: {
    initialValue: "",
    validators: [required],
    constraints: [maxLength],
  },
  email: {
    initialValue: "",
    validators: [required, validateEmail],
    constraints: [maxLength],
  },
});

function RouteComponent() {
  const {
    state: { email, name },
    actions,
  } = useStore(form);

  return (
    <form className="flex flex-col gap-4">
      <label htmlFor="name">
        Name
        <br />
        <input
          className="border-2 rounded p-1 mr-2"
          value={name.value}
          onChange={(e) => actions.name.setValue(e.target.value)}
        />
        {name.error && <div className="text-red-600">{name.error}</div>}
      </label>
      <label htmlFor="email">
        Email
        <br />
        <input
          className="border-2 rounded p-1 mr-2"
          value={email.value}
          onChange={(e) => actions.email.setValue(e.target.value)}
        />
        {email.error && <div className="text-red-600">{email.error}</div>}
      </label>
      <button
        onClick={(e) => {
          e.preventDefault();
          actions.validate();
        }}
      >
        Submit
      </button>
    </form>
  );
}
