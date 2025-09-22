"use client";

import { useLinkStatus } from "next/link";

export default function LoadingIndicator() {
  const { pending } = useLinkStatus();
  return pending ? (
    <div role="status" aria-label="Loading" className="spinner" />
  ) : null;
}

// https://github.com/vercel/react-transition-progress
