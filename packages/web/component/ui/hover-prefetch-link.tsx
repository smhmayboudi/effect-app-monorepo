"use client";

import Link from "next/link";
import { useState } from "react";

export function HoverPrefetchLink({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) {
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
