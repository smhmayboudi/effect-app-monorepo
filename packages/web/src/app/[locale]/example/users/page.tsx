import * as Schema from "effect/Schema";

import { cn } from "@/lib/utils";

import { Client } from "./client";
import { roles } from "./data/data";

const usersSearchSchema = Schema.Struct({
  page: Schema.optionalWith(Schema.Number, { default: () => 1, exact: true }),
  pageSize: Schema.optionalWith(Schema.Number, {
    default: () => 10,
    exact: true,
  }),
  role: Schema.optionalWith(
    Schema.Array(Schema.Literal(...roles.map((r) => r.value))),
    { default: () => [], exact: true },
  ),
  status: Schema.optionalWith(
    Schema.Array(Schema.Literal("active", "inactive", "invited", "suspended")),
    { default: () => [], exact: true },
  ),
  username: Schema.optionalWith(Schema.String, {
    default: () => "",
    exact: true,
  }),
});

export default async function Page() {
  return (
    <div
      className={cn(
        // Set content container, so we can use container queries
        "@container/content",
        // If layout is fixed, set the height
        // to 100svh to prevent overflow
        "has-[[data-layout=fixed]]:h-svh",
        // If layout is fixed and sidebar is inset,
        // set the height to 100svh - spacing (total margins) to prevent overflow
        "peer-data-[variant=inset]:has-[[data-layout=fixed]]:h-[calc(100svh-(var(--spacing)*4))]",
      )}
    >
      <Client />
    </div>
  );
}
