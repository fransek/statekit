/* eslint-disable @typescript-eslint/no-explicit-any */
import { createStore, GetState, SetState } from "./createStore";

export type Validator<T> = (value: T) => string | undefined;

export type Constraint<T> = (value: T) => boolean;

export type FieldController<T> = {
  initialValue: T;
  validators?: Validator<T>[];
  constraints?: Constraint<T>[];
};

export type FormController = {
  [key: string]: FieldController<any>;
};

export type Field<T> = {
  value: T;
  error: string | undefined;
  touched: boolean;
};

export type Form<T extends FormController> = {
  [K in keyof T]: Field<T[K]["initialValue"]>;
};

export type FormActions<T extends FormController> = {
  [K in keyof T]: {
    setValue: (value: Form<T>[K]["value"]) => Form<T>;
  };
} & {
  validate: () => ValidationResult<T>;
};

export const createFormController = <T extends FormController>(
  formController: T,
) => {
  const state = createForm(formController);
  const defineActions = (set: SetState<Form<T>>, get: GetState<Form<T>>) =>
    createActions(formController, state, set, get);
  const store = createStore(state, defineActions);
  return store;
};

const createForm = <T extends FormController>(form: T): Form<T> => {
  return Object.keys(form).reduce((acc, key: keyof T) => {
    acc[key] = {
      value: form[key].initialValue,
      error: undefined,
      touched: false,
    };
    return acc;
  }, {} as Form<T>);
};

const createActions = <T extends FormController>(
  controller: T,
  initialState: Form<T>,
  set: SetState<Form<T>>,
  get: GetState<Form<T>>,
) => {
  const fieldActions = Object.keys(initialState).reduce((acc, key: keyof T) => {
    return {
      ...acc,
      [key]: {
        setValue: (value: Form<T>[typeof key]["value"]) => {
          if (
            controller[key].constraints?.some(
              (constraint) => !constraint(value),
            )
          ) {
            return get();
          }
          const error = validateField(value, controller[key].validators);
          return set((state) => ({
            ...state,
            [key]: {
              ...state[key],
              error,
              value,
              touched: true,
            } as Form<T>[typeof key],
          }));
        },
      } as FormActions<T>[typeof key],
    };
  }, {} as FormActions<T>);

  return {
    ...fieldActions,
    validate: () => {
      const validationResult = validateForm(get(), controller);
      set(validationResult.state);
      return validationResult;
    },
  };
};

const validateField = <T>(
  value: T,
  validators?: Validator<T>[],
): string | undefined => {
  if (!validators) {
    return undefined;
  }
  for (const validator of validators) {
    const error = validator(value);
    if (error) {
      return error;
    }
  }
  return undefined;
};

export type ValidationResult<T extends FormController> = {
  state: Form<T>;
  isValid: boolean;
};

const validateForm = <T extends FormController>(
  form: Form<T>,
  controller: T,
): ValidationResult<T> => {
  let isValid = true;
  const newFormState = Object.keys(form).reduce((acc, key: keyof T) => {
    const error = validateField(form[key].value, controller[key].validators);
    if (error) {
      isValid = false;
    }
    acc[key] = {
      ...form[key],
      error,
    };
    return acc;
  }, {} as Form<T>);
  return {
    state: newFormState,
    isValid,
  };
};
