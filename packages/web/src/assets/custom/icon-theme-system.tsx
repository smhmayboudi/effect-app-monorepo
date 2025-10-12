import { type SVGProps } from "react";

import { cn } from "@/lib/utils";

export function IconThemeSystem({
  className,
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      className={cn(
        "overflow-hidden rounded-[6px]",
        "fill-primary stroke-primary group-data-[state=unchecked]:fill-muted-foreground group-data-[state=unchecked]:stroke-muted-foreground",
        className,
      )}
      data-name="icon-theme-system"
      viewBox="0 0 79.86 51.14"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M0 0.03H22.88V51.17H0z" opacity={0.2} />
      <circle
        cx={6.7}
        cy={7.04}
        fill="#fff"
        opacity={0.8}
        r={3.54}
        stroke="#fff"
        strokeLinecap="round"
        strokeMiterlimit={10}
      />
      <path
        d="M18.12 6.39h-5.87c-.6 0-1.09-.45-1.09-1s.49-1 1.09-1h5.87c.6 0 1.09.45 1.09 1s-.49 1-1.09 1zM16.55 9.77h-4.24c-.55 0-1-.45-1-1s.45-1 1-1h4.24c.55 0 1 .45 1 1s-.45 1-1 1z"
        fill="#fff"
        opacity={0.75}
        stroke="none"
      />
      <path
        d="M18.32 17.37H4.59c-.69 0-1.25-.47-1.25-1.05s.56-1.05 1.25-1.05h13.73c.69 0 1.25.47 1.25 1.05s-.56 1.05-1.25 1.05z"
        fill="#fff"
        opacity={0.72}
        stroke="none"
      />
      <path
        d="M15.34 21.26h-11c-.55 0-1-.41-1-.91s.45-.91 1-.91h11c.55 0 1 .41 1 .91s-.45.91-1 .91z"
        fill="#fff"
        opacity={0.55}
        stroke="none"
      />
      <path
        d="M16.46 25.57H4.43c-.6 0-1.09-.44-1.09-.98s.49-.98 1.09-.98h12.03c.6 0 1.09.44 1.09.98s-.49.98-1.09.98z"
        fill="#fff"
        opacity={0.67}
        stroke="none"
      />
      <rect
        height={3.42}
        opacity={0.31}
        rx={0.33}
        ry={0.33}
        stroke="none"
        width={2.75}
        x={33.36}
        y={19.73}
      />
      <rect
        height={6.58}
        opacity={0.4}
        rx={0.33}
        ry={0.33}
        stroke="none"
        width={2.75}
        x={29.64}
        y={16.57}
      />
      <rect
        height={8.7}
        opacity={0.26}
        rx={0.33}
        ry={0.33}
        stroke="none"
        width={2.75}
        x={37.16}
        y={14.44}
      />
      <rect
        height={12.4}
        opacity={0.37}
        rx={0.33}
        ry={0.33}
        stroke="none"
        width={2.75}
        x={41.19}
        y={10.75}
      />
      <g>
        <circle cx={62.74} cy={16.32} opacity={0.25} r={8} />
        <path
          d="M62.74 16.32l4.1-6.87c1.19.71 2.18 1.72 2.86 2.92s1.04 2.57 1.04 3.95h-8z"
          opacity={0.45}
        />
      </g>
      <rect
        height={18.62}
        opacity={0.3}
        rx={1.69}
        ry={1.69}
        stroke="none"
        strokeLinecap="round"
        strokeMiterlimit={10}
        width={41.62}
        x={29.64}
        y={27.75}
      />
    </svg>
  );
}
