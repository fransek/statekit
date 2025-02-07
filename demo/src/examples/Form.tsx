import { createForm, createStoreContext, useStore } from "@fransek/statekit";
import { useRef } from "react";

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

const FormStoreContext = createStoreContext(() => {
  const validateRepeatEmail = (value: string) => {
    if (value !== form.get().email.value) {
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

  return form;
});

export const Form = () => {
  // Use the store
  const store = useRef(FormStoreContext.instantiate()).current;

  const {
    state,
    actions: { setValue, onBlur, validate },
  } = useStore(store);

  const register = (key: keyof typeof state) =>
    ({
      id: key,
      value: state[key].value,
      onChange: (e) => setValue(key, e.target.value),
      onBlur: onBlur(key),
      error: state[key].error,
    }) satisfies Partial<InputProps>;

  return (
    <form className="flex flex-col gap-2">
      <Input label="Name" {...register("name")} />
      <Input label="Email" {...register("email")} />
      <Input label="Repeat Email" {...register("repeatEmail")} />
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
    </form>
  );
};

interface InputProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  error?: string;
}

const Input = ({ id, label, value, onChange, onBlur, error }: InputProps) => (
  <div className="flex flex-col gap-2">
    <label>{label}</label>
    <input value={value} onChange={onChange} onBlur={onBlur} id={id} />
    {error && (
      <p className="text-red-500" aria-live="polite">
        {error}
      </p>
    )}
  </div>
);
