import type { SVGProps } from "react"

import { cn } from "@/lib/utils"

type IconDirProps = SVGProps<SVGSVGElement> & {
  dir: "ltr" | "rtl"
}

export function IconDir({ className, dir, ...props }: IconDirProps) {
  return (
    <svg
      className={cn({ "rotate-y-180": dir === "rtl" }, className)}
      data-name={`icon-dir-${dir}`}
      viewBox="0 0 79.86 51.14"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M23.42.51h51.92c2.21 0 4 1.79 4 4v42.18c0 2.21-1.79 4-4 4H23.42s-.04-.02-.04-.04V.55s.02-.04.04-.04z"
        opacity={0.15}
      />
      <path
        d="M5.56 14.88L17.78 14.88"
        fill="none"
        opacity={0.72}
        strokeLinecap="round"
        strokeMiterlimit={10}
        strokeWidth="2px"
      />
      <path
        d="M5.56 22.09L16.08 22.09"
        fill="none"
        opacity={0.48}
        strokeLinecap="round"
        strokeMiterlimit={10}
        strokeWidth="2px"
      />
      <path
        d="M5.56 18.38L14.93 18.38"
        fill="none"
        opacity={0.55}
        strokeLinecap="round"
        strokeMiterlimit={10}
        strokeWidth="2px"
      />
      <g strokeLinecap="round" strokeMiterlimit={10}>
        <circle cx={7.51} cy={7.4} opacity={0.8} r={2.54} />
        <path
          d="M12.06 6.14L17.78 6.14"
          fill="none"
          opacity={0.8}
          strokeWidth="2px"
        />
        <path d="M11.85 8.79L16.91 8.79" fill="none" opacity={0.6} />
      </g>
      <path
        d="M29.41 7.4L34.67 7.4"
        fill="none"
        opacity={0.62}
        strokeLinecap="round"
        strokeMiterlimit={10}
        strokeWidth="3px"
      />
      <rect
        height={2.73}
        opacity={0.44}
        rx={0.64}
        ry={0.64}
        strokeLinecap="round"
        strokeMiterlimit={10}
        width={26.03}
        x={28.76}
        y={11.21}
      />
      <rect
        height={13.48}
        opacity={0.3}
        rx={0.64}
        ry={0.64}
        strokeLinecap="round"
        strokeMiterlimit={10}
        width={44.25}
        x={28.76}
        y={17.01}
      />
      <rect
        height={4.67}
        opacity={0.21}
        rx={0.64}
        ry={0.64}
        strokeLinecap="round"
        strokeMiterlimit={10}
        width={44.25}
        x={28.76}
        y={33.57}
      />
      <rect
        height={4.67}
        opacity={0.3}
        rx={0.64}
        ry={0.64}
        strokeLinecap="round"
        strokeMiterlimit={10}
        width={36.21}
        x={28.76}
        y={41.32}
      />
    </svg>
  )
}
