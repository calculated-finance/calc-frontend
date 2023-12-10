// useQueryParamStore.js
import { useLocation, useNavigate } from 'react-router-dom';
import queryString from 'query-string';
import { either, isEmpty, isNil, reject } from 'rambda';

function useQueryParamStore(key: string) {
  const navigate = useNavigate();
  const { search } = useLocation();

  const getQueryParams = () => queryString.parse(queryString.parse(search)[key] as string);

  return {
    queryParams: getQueryParams(),
    updateValues: (newParams: object, overwrite = false) =>
      navigate({
        search: queryString.stringify({
          [key]: queryString.stringify(
            reject(either(isNil, isEmpty), { ...(overwrite ? {} : getQueryParams()), ...newParams }),
          ),
        }),
      }),
  };
}

export default useQueryParamStore;
