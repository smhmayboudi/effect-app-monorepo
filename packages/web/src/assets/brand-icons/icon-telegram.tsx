import type { SVGProps } from "react"

import { cn } from "@/lib/utils"

export function IconTelegram({ className, ...props }: SVGProps<SVGSVGElement>) {
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
      <title>Telegram</title>
      <path d="M0 0h24v24H0z" fill="none" strokeWidth="0" />
      <path d="M15 10l-4 4l6 6l4 -16l-18 7l4 2l2 6l3 -4" />
    </svg>
  )
}
