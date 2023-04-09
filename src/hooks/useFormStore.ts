import { dcaSchema, initialValues } from '@models/DcaInFormData';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export enum FormNames {
  DcaIn = 'dcaIn',
  DcaOut = 'dcaOut',
  DcaPlusIn = 'dcaPlusIn',
  DcaPlusOut = 'dcaPlusOut',
}

type IFormStore = {
  forms: any;
  updateForm: (formName: FormNames) => (payload: any) => void;
  resetForm: (formName: FormNames) => () => void;
};

export const useFormStore = create<IFormStore>()(
  persist(
    (set) => ({
      forms: {},
      updateForm: (formName: FormNames) => (payload: any) =>
        set((state: any) => ({
          forms: {
            ...state.forms,
            [formName]: {
              ...state.forms[formName],
              ...payload,
            },
          },
        })),
      resetForm: (formName: FormNames) => () =>
        set((state: any) => ({
          forms: {
            ...state.forms,
            [formName]: dcaSchema.cast(initialValues, { stripUnknown: true }),
          },
        })),
    }),
    { name: 'dcaInForm-storage', serialize: JSON.stringify, deserialize: JSON.parse },
  ),
);
