import type { SVGProps } from "react";

import { cn } from "@/lib/utils";

export function IconGmail({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      className={cn("[&>path]:stroke-current", className)}
      fill="none"
      height="24"
      role="img"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>Gmail</title>
      <path d="M0 0h24v24H0z" fill="none" strokeWidth="0" />
      <path d="M16 20h3a1 1 0 0 0 1 -1v-14a1 1 0 0 0 -1 -1h-3v16z" />
      <path d="M5 20h3v-16h-3a1 1 0 0 0 -1 1v14a1 1 0 0 0 1 1z" />
      <path d="M16 4l-4 4l-4 -4" />
      <path d="M4 6.5l8 7.5l8 -7.5" />
    </svg>
  );
}
