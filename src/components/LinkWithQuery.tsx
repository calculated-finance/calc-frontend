import Link, { LinkProps } from "next/link";
import { useRouter } from "next/router";
import { PropsWithChildren } from "react";

function LinkWithQuery({ href, ...props }: LinkProps & PropsWithChildren) {
  const router = useRouter();

  const pathname = typeof href === "object" ? href.pathname : href;

  const query =
    typeof href === "object" && typeof href.query === "object"
      ? href.query
      : {};

  return (
    <Link
      {...props}
      href={{
        pathname,
        query: {
          ...query,
          chain: router.query.chain,
        },
      }}
    />
  );
}
export default LinkWithQuery;

