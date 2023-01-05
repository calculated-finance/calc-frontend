import { set } from 'lodash';
import * as Yup from 'yup';

function getErrorName(error: unknown) {
  if (error instanceof Error) return error.name;
  return String(error);
}

const useValidation = (validationSchema: Yup.AnySchema, context = {}) => {
  const validate = (values: Yup.InferType<typeof validationSchema>) => {
    try {
      validationSchema.validateSync(values, {
        abortEarly: false,
        context,
      });
    } catch (error) {
      if (getErrorName(error) !== 'ValidationError') {
        throw error;
      }
      if (error instanceof Yup.ValidationError) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return error.inner.reduce((errors: Yup.ValidationError[], currentError) => {
          // eslint-disable-next-line no-param-reassign
          errors = set(errors, currentError.path as string, currentError.message);
          console.log(errors);
          return errors;
        }, {});
      }
    }
    return {};
  };
  return {
    validate,
  };
};

export default useValidation;
