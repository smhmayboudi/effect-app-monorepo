"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState, type ComponentProps } from "react";

export function PasswordInput({
  className,
  ...props
}: Omit<ComponentProps<typeof Input>, "type">) {
  const [showPassword, setShowPassword] = useState(false);
  const Icon = showPassword ? EyeOffIcon : EyeIcon;

  return (
    <div className="relative">
      <Input
        {...props}
        className={cn("pe-9", className)}
        type={showPassword ? "text" : "password"}
      />
      <Button
        className="absolute inset-y-1/2 end-1 size-7 -translate-y-1/2"
        onClick={(e) => {
          e.preventDefault();
          setShowPassword((p) => !p);
        }}
        size="icon"
        variant="outline"
      >
        <Icon className="size-5" />
        <span className="sr-only">
          {showPassword ? "Hide password" : "Show password"}
        </span>
      </Button>
    </div>
  );
}
