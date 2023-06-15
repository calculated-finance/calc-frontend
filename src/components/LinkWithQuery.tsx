import Link, { LinkProps } from "next/link";
import { useRouter } from "next/router";
import { PropsWithChildren } from "react";

const persistedQueryParams = ["chain"];

function LinkWithQuery({ href, ...props }: LinkProps & PropsWithChildren) {
  const router = useRouter();

  const pathname = typeof href === "object" ? href.pathname : href;

  const query =
    typeof href === "object" && typeof href.query === "object"
      ? href.query
      : {};


  const persistedRouterQueries = Object.keys(router.query).reduce(
    (acc, key) => {
        if (persistedQueryParams.includes(key)) {
            acc[key] = router.query[key];
        }
        return acc;
    },
    {}
    );


  return (
    <Link
      {...props}
      href={{
        pathname,
        query: {
          ...query,
          ...persistedRouterQueries,
        },
      }}
    />
  );
}
export default LinkWithQuery;

