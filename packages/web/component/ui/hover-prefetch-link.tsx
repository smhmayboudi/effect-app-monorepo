"use client";

import Link from "next/link";
import { useState } from "react";

type HoverPrefetchLinkProps = {
  children: React.ReactNode;
  href: string;
};

export function HoverPrefetchLink({ children, href }: HoverPrefetchLinkProps) {
  const [active, setActive] = useState(false);

  return (
    <Link
      href={href}
      onMouseEnter={() => setActive(true)}
      prefetch={active ? null : false}
    >
      {children}
    </Link>
  );
}
