import { createForm, createStore, useStore } from "@fransek/statekit";

const mandatory = (value: string) => {
  if (!value) {
    return "This field is mandatory";
  }
};

const validateEmail = (value: string) => {
  if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) {
    return "Invalid email";
  }
};

const validateRepeatEmail = (value: string) => {
  if (value !== store.get().email.value) {
    return "Emails do not match";
  }
};

const form = createForm({
  name: {
    defaultValue: "",
    validators: [mandatory],
  },
  email: {
    defaultValue: "",
    validators: [mandatory, validateEmail],
  },
  repeatEmail: {
    defaultValue: "",
    validators: [mandatory, validateRepeatEmail, validateEmail],
  },
});

const store = createStore(
  {
    ...form.initialState,
  },
  (set, get) => ({
    ...form.defineActions(set, get),
  }),
);

export const Form = () => {
  const {
    state,
    actions: { setValue, onBlur, validate },
  } = useStore(store);

  return (
    <div className="flex flex-col gap-2">
      <Input
        label="Name"
        id="name"
        value={state.name.value}
        error={state.name.error}
        onChange={(e) => setValue("name", e.target.value)}
        onBlur={onBlur("name")}
      />
      <Input
        label="Email"
        id="email"
        value={state.email.value}
        error={state.email.error}
        onChange={(e) => setValue("email", e.target.value)}
        onBlur={onBlur("email")}
      />
      <Input
        label="Repeat Email"
        id="repeatEmail"
        value={state.repeatEmail.value}
        error={state.repeatEmail.error}
        onChange={(e) => setValue("repeatEmail", e.target.value)}
        onBlur={onBlur("repeatEmail")}
      />
      <button
        onClick={(e) => {
          e.preventDefault();
          const { isValid } = validate();
          if (isValid) {
            alert("Success!");
          }
        }}
      >
        Submit
      </button>
    </div>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = ({ label, error, ...props }: InputProps) => (
  <div className="flex flex-col gap-2">
    {label && <label>{label}</label>}
    <input {...props} />
    {error && (
      <p className="text-red-500" aria-live="polite">
        {error}
      </p>
    )}
  </div>
);
