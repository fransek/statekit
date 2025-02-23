import { createStore, DefineActions, StateModifier } from "../core/createStore";
import { merge } from "./merge";

export type Validator<T> = (value: T) => string | undefined;

export type FieldControl<T> = {
  defaultValue: T;
  validators?: Validator<T>[];
};

export type FieldState<T> = {
  value: T;
  error: string | undefined;
  isTouched: boolean;
};

export type Form<T extends Form<T>> = {
  [K in keyof T]: FieldControl<T[K]["defaultValue"]>;
};

export type FormState<T extends Form<T>> = {
  [K in keyof T]: FieldState<T[K]["defaultValue"]>;
};

export type FormActions<T extends Form<T>> = {
  setValue: <K extends keyof T>(key: K, value: T[K]["defaultValue"]) => void;
  setValues: (
    values: Partial<Record<keyof T, T[keyof T]["defaultValue"]>>,
  ) => void;
  onBlur: <K extends keyof T>(key: K) => () => void;
  validate: (autoFocus?: boolean) => {
    validatedForm: FormState<T>;
    firstError: HTMLElement | null;
    isValid: boolean;
  };
  validateField: <K extends keyof T>(key: K) => void;
  reset: () => void;
};

export const createForm = <T extends Form<T>>(fields: T) => {
  const initialState = Object.keys(fields).reduce((acc, key) => {
    acc[key as keyof T] = {
      value: fields[key as keyof T].defaultValue,
      error: undefined,
      isTouched: false,
    };
    return acc;
  }, {} as FormState<T>);

  const defineActions: DefineActions<FormState<T>, FormActions<T>> = (
    set,
    get,
  ) => {
    const setField = <K extends keyof T>(
      key: K,
      field: StateModifier<FormState<T>[K]>,
    ) =>
      set((state) => ({
        ...state,
        [key]: merge(state[key], field),
      }));

    const setValue = <K extends keyof T>(key: K, value: T[K]["defaultValue"]) =>
      setField(key, (state) => ({
        ...state,
        value,
        error: state.isTouched
          ? validateInput(value, fields[key].validators)
          : undefined,
      }));

    const setValues = (
      values: Partial<Record<keyof T, T[keyof T]["defaultValue"]>>,
    ) =>
      set((state) => {
        const newState = { ...state };
        for (const key in values) {
          newState[key] = {
            ...newState[key],
            value: values[key],
          };
        }
        return newState;
      });

    const onBlur =
      <K extends keyof T>(key: K) =>
      () => {
        const curr = get()[key];

        if (!curr.isTouched && curr.value) {
          setField(key, (state) => ({
            ...state,
            isTouched: true,
            error: validateInput(get()[key].value, fields[key].validators),
          }));
        }
      };

    const validate = (autoFocus = true) => {
      const errorRefMap = new Map<keyof T, HTMLElement>();
      let firstError: HTMLElement | null = null;
      let isValid = true;

      const validatedForm = set((state) => {
        const newState = { ...state };

        for (const key in fields) {
          const error = validateInput(
            newState[key].value,
            fields[key].validators,
          );
          newState[key] = {
            ...newState[key],
            error,
            isTouched: true,
          };

          if (error) {
            isValid = false;
            if (autoFocus) {
              const element = document.getElementById(key);
              if (element) {
                errorRefMap.set(key, element);
              }
            }
          }
        }

        if (autoFocus) {
          firstError = getFirstElement(Array.from(errorRefMap.values()));
          firstError?.focus();
        }

        return newState;
      });

      return { validatedForm, firstError, isValid };
    };

    const validateField = <K extends keyof T>(key: K) =>
      setField(key, (state) => ({
        ...state,
        error: validateInput(state.value, fields[key].validators),
        isTouched: true,
      }));

    const reset = () => {
      set(initialState);
    };

    return {
      setValue,
      setValues,
      onBlur,
      validate,
      validateField,
      reset,
    };
  };

  return { initialState, defineActions };
};

const validateInput = <T>(value: T, validators?: Validator<T>[]) => {
  if (!validators) return undefined;

  for (const validator of validators) {
    const error = validator(value);
    if (error) {
      return error;
    }
  }

  return undefined;
};

const getFirstElement = (elements: HTMLElement[]): HTMLElement | null => {
  if (elements.length === 0) return null;

  return elements.reduce((first, current) =>
    first.compareDocumentPosition(current) & Node.DOCUMENT_POSITION_PRECEDING
      ? current
      : first,
  );
};

export const createFormStore = <T extends Form<T>>(
  form: ReturnType<typeof createForm>,
) => createStore(form.initialState, form.defineActions);
