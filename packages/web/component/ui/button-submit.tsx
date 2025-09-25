"use client";

import { sendGTMEvent } from "@next/third-parties/google";
import { ButtonHTMLAttributes } from "react";
import { useFormStatus } from "react-dom";

export interface ButtonSubmitProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  formName: string;
}

export function ButtonSubmit({ formName, ...props }: ButtonSubmitProps) {
  const { pending } = useFormStatus();

  const handleClick = () => {
    sendGTMEvent({
      buttonText: "Submit",
      event: "formSubmission",
      status: pending ? "pending" : "submitting",
      value: formName,
    });
  };

  return (
    <button
      aria-disabled={pending}
      disabled={pending}
      type="submit"
      onClick={handleClick}
      {...props}
    >
      {pending ? "Submitting..." : "Submit"}
    </button>
  );
}
