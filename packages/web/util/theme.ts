import { cookies } from "next/headers";
import type { ThemePreference } from "@/component/theme-provider";

const name = "__next_theme";

export async function getThemePreferenceFromCookie(): Promise<ThemePreference> {
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get(name);

  return themeCookie?.value === "dark" ||
    themeCookie?.value === "light" ||
    themeCookie?.value === "system"
    ? themeCookie.value
    : "system";
}

export async function setThemePreferenceToCookie(value: ThemePreference) {
  const cookieStore = await cookies();
  cookieStore.set({
    httpOnly: false,
    name,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    value,
  });
}
