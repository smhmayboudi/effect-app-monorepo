"use client";

import { sendGTMEvent } from "@next/third-parties/google";
import { ButtonHTMLAttributes } from "react";
import { useFormStatus } from "react-dom";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  formName: string;
}

export default function Button({ formName, ...props }: ButtonProps) {
  const { pending } = useFormStatus();

  const handleClick = () => {
    sendGTMEvent({
      buttonText: "submit",
      event: "form-submit",
      status: pending ? "pending" : "submitting",
      value: formName,
    });
  };

  return (
    <button
      aria-disabled={pending}
      disabled={pending}
      onClick={handleClick}
      type="submit"
      {...props}
    >
      {pending ? "Submitting..." : "Submit"}
    </button>
  );
}
