"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { GalleryVerticalEnd } from "lucide-react";
import Link from "@/components/ui/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup } from "@/components/ui/field";

export default function Client() {
  const { data, isPending, refetch } = authClient.useSession();
  const [cookies, setCookies] = useState<string>("");

  useEffect(() => {
    refetch();
    setCookies(document.cookie);
  }, [refetch]);

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-xl flex-col gap-6">
        <Link
          href="#"
          className="flex items-center gap-2 self-center font-medium"
        >
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Acme Inc.
        </Link>
        <div className={cn("flex flex-col gap-6")}>
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Debug Auth</CardTitle>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <Field>
                  <strong>Cookies in document</strong> {cookies || "None"}
                </Field>
                <Field>
                  <strong>Session</strong>
                  {data ? JSON.stringify(data, null, 2) : "No session"}
                </Field>
                <Field>
                  <strong>Loading</strong> {isPending ? "Yes" : "No"}
                </Field>
                <Field>
                  <Button
                    aria-disabled={isPending}
                    className="w-full"
                    disabled={isPending}
                    onClick={() => refetch()}
                  >
                    {isPending ? "Refreshing..." : "Refresh"}
                  </Button>
                </Field>
              </FieldGroup>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
