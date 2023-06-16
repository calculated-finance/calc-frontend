import { NextRouter } from 'next/router';
import { ParsedUrlQueryInput } from 'querystring';

export function routerPush(router: NextRouter, path: string, query?: ParsedUrlQueryInput) {
  const newQuery = { ...query, chain: router.query.chain };
  router.push({ pathname: path, query: newQuery });
}
