import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

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
            [formName]: {},
          },
        })),
    }),
    {
      name: 'form-state',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
