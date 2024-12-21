import { createStore } from "./createStore";

type FormControllerSchema = Record<string, FieldController<unknown>>;

export type FormController<T extends FormControllerSchema> = {
  [K in keyof T]: FieldController<T[K]["initialValue"]>;
};

export type FormState<T extends FormController<T>> = {
  [K in keyof T]: {
    value: T[K]["initialValue"];
    error: string | undefined;
  };
};

export type FieldController<T> = {
  initialValue: T;
  validators?: Validator<T>[];
};

export type FormActions<T extends FormController<T>> = {
  setValue: {
    [K in keyof T]: (value: T[K]["initialValue"]) => FormState<T>;
  };
  validate: () => FormValidationResult<T>;
};

type FormValidationResult<T extends FormController<T>> = {
  isValid: boolean;
  form: FormState<T>;
};

export type Validator<T> = (value: T) => string | void;

export const createFormController = <T extends FormController<T>>(
  formController: T,
) => {
  const state = {} as FormState<T>;

  for (const key in formController) {
    state[key] = {
      value: formController[key].initialValue,
      error: undefined,
    };
  }

  return createStore(state, (set, get) => {
    const actions = {
      setValue: {},
      validate: () => {
        const result = validateForm(get(), formController);
        set(result.form);
        return result;
      },
    } as FormActions<T>;

    for (const key in formController) {
      actions.setValue[key] = (value) => {
        const error = validateField(value, formController[key].validators);

        return set((state) => ({
          ...state,
          [key]: {
            ...state[key],
            error,
            value,
          },
        }));
      };
    }

    return actions;
  });
};

const validateField = <T>(value: T, validators?: Validator<T>[]) => {
  if (!validators) {
    return;
  }
  for (const validator of validators) {
    const error = validator(value);

    if (error) {
      return error;
    }
  }
};

const validateForm = <T extends FormController<T>>(
  form: FormState<T>,
  formController: T,
): FormValidationResult<T> => {
  const newForm = { ...form };
  let isValid = true;

  for (const key in formController) {
    const error = validateField(
      form[key].value,
      formController[key].validators,
    );
    if (error) {
      isValid = false;
    }
    newForm[key] = {
      value: form[key].value,
      error,
    };
  }

  return {
    isValid,
    form: newForm,
  };
};
