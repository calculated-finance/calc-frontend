import { set } from 'lodash';
import * as Yup from 'yup';

const useValidation = (validationSchema: Yup.AnySchema, context = {}) => {
  const validate = (values: Yup.InferType<typeof validationSchema>) => {
    try {
      validationSchema.validateSync(values, {
        abortEarly: false,
        context,
      });
    } catch (error: any) {
      console.log(error);
      if (error.name !== 'ValidationError') {
        throw error;
      }

      return error.inner.reduce((errors: Yup.ValidationError[], currentError: Yup.ValidationError) => {
        // eslint-disable-next-line no-param-reassign
        errors = set(errors, currentError.path as string, currentError.message);
        console.log(errors);
        return errors;
      }, {});
    }
    return {};
  };
  return {
    validate,
  };
};

export default useValidation;
