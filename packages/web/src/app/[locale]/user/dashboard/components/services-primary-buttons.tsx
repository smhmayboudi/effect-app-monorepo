"use client";

import { UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useUsers } from "./services-provider";

export function ServicesPrimaryButtons() {
  const { setOpen } = useUsers();

  return (
    <div className="flex gap-2">
      <Button className="space-x-1" onClick={() => setOpen("create")}>
        <span>Service Create</span>
        <UserPlus size={18} />
      </Button>
    </div>
  );
}
