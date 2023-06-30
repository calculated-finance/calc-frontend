import { NextRouter } from 'next/router';
import { ParsedUrlQueryInput } from 'querystring';
import { Url, UrlObject } from 'url';

export function routerPush(router: NextRouter, href: Url | UrlObject | string, query?: ParsedUrlQueryInput) {
  const pathname = typeof href === 'object' ? href.pathname : href;

  const passedQuery = typeof href === 'object' && typeof href.query === 'object' ? href.query : {};
  const newQuery = { ...query, ...passedQuery, chain: router.query.chain };
  router.push({ pathname, query: newQuery });
}
