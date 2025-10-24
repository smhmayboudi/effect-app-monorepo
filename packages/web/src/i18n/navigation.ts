import { createNavigation } from "next-intl/navigation"

import { routing } from "./routing"

export const {
  getPathname,
  Link,
  permanentRedirect,
  redirect,
  usePathname,
  useRouter,
} = createNavigation(routing)
