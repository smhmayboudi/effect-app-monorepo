import { routing } from "./routing";
import { createNavigation } from "next-intl/navigation";

export const {
  Link,
  getPathname,
  permanentRedirect,
  redirect,
  usePathname,
  useRouter,
} = createNavigation(routing);
