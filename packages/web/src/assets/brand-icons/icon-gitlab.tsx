import type { SVGProps } from "react"

import { cn } from "@/lib/utils"

export function IconGitlab({ className, ...props }: SVGProps<SVGSVGElement>) {
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
      <title>GitLab</title>
      <path d="M0 0h24v24H0z" fill="none" strokeWidth="0" />
      <path d="M21 14l-9 7l-9 -7l3 -11l3 7h6l3 -7z" />
    </svg>
  )
}
