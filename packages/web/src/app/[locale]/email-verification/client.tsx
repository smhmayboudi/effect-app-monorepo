"use client";

import { GalleryVerticalEnd } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "@/components/ui/link";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Client() {
  const t = useTranslations("email-verification");
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "me@example.com";

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
              <CardTitle className="text-xl">{t("title")}</CardTitle>
            </CardHeader>
            <CardContent>{t("content", { email })}</CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
