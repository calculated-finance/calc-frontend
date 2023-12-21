import { useLocation, useNavigate } from 'react-router-dom';
import queryString from 'query-string';
import { either, isEmpty, isNil, reject } from 'rambda';
import { useCallback } from 'react';

function useQueryState(): [{ [x: string]: any }, (value: { [x: string]: any }, overwrite?: boolean) => void] {
  const navigate = useNavigate();
  const { search } = useLocation();

  const setQueryParam = useCallback(
    (value: { [x: string]: any }, overwrite = false) =>
      navigate({
        search: queryString.stringify(
          reject(either(isNil, isEmpty), { ...(overwrite ? {} : queryString.parse(search)), ...value }),
        ),
      }),
    [search],
  );

  return [queryString.parse(search), setQueryParam];
}

export default useQueryState;
