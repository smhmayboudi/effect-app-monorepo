"use client";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html dir="ltr" lang="en">
      <body>
        <h2>Something went wrong!</h2>
        <p>{String(error)}</p>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  );
}
