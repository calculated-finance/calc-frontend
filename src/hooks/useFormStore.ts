import { isNil } from 'lodash';
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
  address: string | null;
  updateForm: (formName: FormNames, address: string | undefined) => (payload: any) => void;
  resetForm: (formName: FormNames) => () => void;
};

export const useFormStore = create<IFormStore>()(
  persist(
    (set, get) => ({
      address: null,
      forms: {},
      updateForm: (formName: FormNames, address: string | undefined) => {
        if (get().address && !isNil(address) && get().address !== address) {
          get().resetForm(formName)();
        }
        return (payload: any) =>
          set((state: any) => ({
            forms: {
              ...state.forms,
              [formName]: {
                ...state.forms[formName],
                ...payload,
              },
            },
            address,
          }));
      },

      resetForm: (formName: FormNames) => () =>
        set((state: any) => ({
          forms: {
            ...state.forms,
            [formName]: {},
          },
          address: null,
        })),
    }),
    {
      name: 'form-state',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
