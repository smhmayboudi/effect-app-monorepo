"use client";

import * as React from "react";
import { Link as Linki18, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { useLocale } from "next-intl";
import { LinkProps } from "next/link";

const Link = ({
  children,
  className,
  classNameActive,
  ...props
}: React.PropsWithChildren<LinkProps> & {
  className?: string;
  classNameActive?: string;
}) => {
  const locale = useLocale();
  const pathname = usePathname();
  const [computedClassName, setComputedClassName] = React.useState(className);

  React.useEffect(() => {
    if (pathname) {
      const activePathname = new URL(pathname, location.href).pathname;
      const linkPathname = new URL(
        props.as?.toString() ?? props.href.toString(),
        location.href,
      ).pathname;
      const newClassName =
        activePathname === linkPathname
          ? cn(className, classNameActive)
          : className;
      if (newClassName !== computedClassName) {
        setComputedClassName(newClassName);
      }
    }
  }, [
    className,
    classNameActive,
    computedClassName,
    pathname,
    props.as,
    props.href,
  ]);

  return (
    <Linki18 {...props} className={computedClassName} locale={locale}>
      {children}
    </Linki18>
  );
};

export default Link;
