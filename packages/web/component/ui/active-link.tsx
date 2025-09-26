"use client";

import { LinkProps } from "next/link";
import React, { PropsWithChildren, useEffect, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { useLocale } from "next-intl";

const getLinkUrl = (href: LinkProps["href"], as?: LinkProps["as"]): string =>
  // Dynamic route will be matched via props.as
  // Static route will be matched via props.href
  as ? as.toString() : href.toString();

type ActiveLinkProps = LinkProps & {
  className?: string;
  activeClassName: string;
};

const ActiveLink = ({
  children,
  activeClassName,
  className,
  ...props
}: PropsWithChildren<ActiveLinkProps>) => {
  const pathname = usePathname();
  const locale = useLocale();
  const [computedClassName, setComputedClassName] = useState(className);

  useEffect(() => {
    if (pathname) {
      const linkUrl = getLinkUrl(props.href, props.as);

      const linkPathname = new URL(linkUrl, location.href).pathname;
      const activePathname = new URL(pathname, location.href).pathname;

      const newClassName =
        linkPathname === activePathname
          ? `${className} ${activeClassName}`.trim()
          : className;

      if (newClassName !== computedClassName) {
        setComputedClassName(newClassName);
      }
    }
  }, [
    pathname,
    props.as,
    props.href,
    activeClassName,
    className,
    computedClassName,
  ]);

  return (
    <Link className={computedClassName} {...props} locale={locale}>
      {children}
    </Link>
  );
};

export default ActiveLink;
