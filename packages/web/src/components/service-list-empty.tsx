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
import { List, PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";

export function ServiceListEmpty() {
  const t = useTranslations("component.service-list-empty");

  return (
    <Empty className="from-muted/50 to-background h-full bg-gradient-to-b from-30%">
      <EmptyHeader>
        <EmptyMedia variant="icon">
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
