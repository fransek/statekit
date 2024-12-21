import { createFormController, useStore, Validator } from "@fransek/statekit";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/form")({
  component: RouteComponent,
});

const required: Validator<unknown> = (value) => {
  if (!value) {
    return "Required field";
  }
};

const validateEmail: Validator<string> = (value) => {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return "Invalid email";
  }
};

const nameFirst: Validator<string> = (value) => {
  if (value && !form.get().name.value) {
    return "Enter your name first";
  }
};

const form = createFormController({
  name: {
    initialValue: "",
    validators: [required],
  },
  email: {
    initialValue: "",
    validators: [nameFirst, required, validateEmail],
  },
});

function RouteComponent() {
  const {
    state: { email, name },
    actions: { setValue, validate },
  } = useStore(form);

  return (
    <form className="flex flex-col gap-4">
      <label htmlFor="name">
        Name
        <br />
        <input
          className="border-2 rounded p-1 mr-2"
          value={name.value}
          onChange={(e) => setValue.name(e.target.value)}
        />
        {name.error && <div className="text-red-600">{name.error}</div>}
      </label>
      <label htmlFor="email">
        Email
        <br />
        <input
          className="border-2 rounded p-1 mr-2"
          value={email.value}
          onChange={(e) => setValue.email(e.target.value)}
        />
        {email.error && <div className="text-red-600">{email.error}</div>}
      </label>
      <button
        onClick={(e) => {
          e.preventDefault();
          const { isValid, form } = validate();
          console.log(isValid, form);
        }}
      >
        Submit
      </button>
    </form>
  );
}
