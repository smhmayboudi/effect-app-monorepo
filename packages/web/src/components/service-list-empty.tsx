import { List, PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import Link from "@/components/ui/link";

export function ServiceListEmpty() {
  const t = useTranslations("components.service-list-empty");

  return (
    <Empty className="h-full bg-gradient-to-b from-muted/50 from-30% to-background">
      <EmptyHeader>
        <EmptyMedia
          className="flex size-10 items-center justify-center rounded-md bg-primary text-primary-foreground"
          variant="icon"
        >
          <List />
        </EmptyMedia>
        <EmptyTitle>{t("title")}</EmptyTitle>
        <EmptyDescription>{t("description")}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline">
          <PlusIcon />
          <Link href="/user/service-create">{t("serviceCreate")}</Link>
        </Button>
      </EmptyContent>
    </Empty>
  );
}
