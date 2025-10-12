"use client";

import { Check, Moon, Sun } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/context/theme-provider";
import { cn } from "@/lib/utils";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost">
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          defaultChecked={theme === "light"}
          onClick={() => setTheme("light")}
        >
          Light
          <Check
            className={cn("ms-auto", theme !== "light" && "hidden")}
            size={14}
          />
        </DropdownMenuItem>
        <DropdownMenuItem
          defaultChecked={theme === "dark"}
          onClick={() => setTheme("dark")}
        >
          Dark
          <Check
            className={cn("ms-auto", theme !== "dark" && "hidden")}
            size={14}
          />
        </DropdownMenuItem>
        <DropdownMenuItem
          defaultChecked={theme === "system"}
          onClick={() => setTheme("system")}
        >
          System
          <Check
            className={cn("ms-auto", theme !== "system" && "hidden")}
            size={14}
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
