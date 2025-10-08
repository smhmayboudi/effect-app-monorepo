"use client";

import { useTranslations } from "next-intl";
import Link from "@/components/ui/link";
import { ExternalLink, GalleryVerticalEnd } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";

export default function Client() {
  const t = useTranslations("user.service-help");
  const searchParams = useSearchParams();
  const serviceId =
    searchParams.get("serviceId") ?? "00000000-0000-0000-0000-000000000000";

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
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
              <CardTitle className="text-xl">{t("title2")}</CardTitle>
              <CardDescription>{t("content", { serviceId })}</CardDescription>
            </CardHeader>
            <CardContent>
              <a
                href={`http://127.0.0.1:3001/api/v1/auth/${serviceId}/reference`}
                target="_blank"
              >
                {t("reference")} <ExternalLink />
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
