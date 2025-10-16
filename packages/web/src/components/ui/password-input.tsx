"use client";

import { EyeIcon, EyeOffIcon } from "lucide-react";
import { type InputHTMLAttributes, type Ref, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type PasswordInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> & {
  ref?: Ref<HTMLInputElement>;
};

export function PasswordInput({
  className,
  disabled,
  ref,
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={cn("relative", className)}>
      <Input
        className="pe-9"
        disabled={disabled}
        ref={ref}
        type={showPassword ? "text" : "password"}
        {...props}
      />
      <Button
        className="absolute inset-y-1/2 end-1 top-1/2 size-7 -translate-y-1/2 text-muted-foreground"
        disabled={disabled}
        onClick={() => setShowPassword((p) => !p)}
        size="icon"
        type="button"
        variant="outline"
      >
        {showPassword ? (
          <EyeIcon size="size-5" />
        ) : (
          <EyeOffIcon size="size-5" />
        )}
        <span className="sr-only">
          {showPassword ? "Hide password" : "Show password"}
        </span>
      </Button>
    </div>
  );
}
