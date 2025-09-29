"use client";

import { useLocale } from "next-intl";
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useBroadcastChannel } from "./broadcast-channel-provider";

export type ThemePreference = "dark" | "light" | "system";

type ThemeMessage = {
  theme: ThemePreference;
  type: "THEME_THEME";
};

interface ThemeContextType {
  currentTheme: "dark" | "light";
  isHydrated: boolean;
  setThemePreference: Dispatch<SetStateAction<ThemePreference>>;
  themePreference: ThemePreference;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

interface ThemeProviderProps {
  serverThemePreference?: ThemePreference;
}

export default function ThemeProvider({
  children,
  serverThemePreference = "system",
}: PropsWithChildren<ThemeProviderProps>) {
  const broadcastChannel = useBroadcastChannel();
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">(
    serverThemePreference === "dark" ? "dark" : "light"
  );
  const [isHydrated, setIsHydrated] = useState(false);
  const [themePreference, setThemePreference] = useState<ThemePreference>(
    serverThemePreference
  );

  useEffect(() => {
    const fetchInitialTheme = async () => {
      // const response = await fetch(
      //   href("/api/preferences/*", { "*": "theme" })
      // );
      // const data: {
      //   theme: ThemePreference;
      // } = await response.json();
      // setThemePreference(data.theme || "system");
      setThemePreference("system");
      setIsHydrated(true);
    };

    fetchInitialTheme();
  }, []);

  broadcastChannel &&
    broadcastChannel.onMessage<ThemeMessage>((message) => {
      if (message.type === "THEME_THEME") {
        setThemePreference(message.theme);
      }
    });

  const handleSetThemePreference = useCallback<
    Dispatch<SetStateAction<ThemePreference>>
  >((action) => {
    setThemePreference((prev) => {
      const theme = typeof action === "function" ? action(prev) : action;
      broadcastChannel &&
        broadcastChannel.postMessage<ThemeMessage>({
          type: "THEME_THEME",
          theme,
        });
      // fetch(href("/api/preferences/*", { "*": "theme" }), {
      //   body: JSON.stringify({ theme: theme }),
      //   headers: { "Content-Type": "application/json" },
      //   method: "POST",
      // });
      return theme;
    });
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemChange = (event: MediaQueryListEvent) => {
      if (themePreference === "system") {
        setCurrentTheme(event.matches ? "dark" : "light");
      }
    };
    if (themePreference === "system") {
      setCurrentTheme(mediaQuery.matches ? "dark" : "light");
    } else {
      setCurrentTheme(themePreference);
    }
    mediaQuery.addEventListener("change", handleSystemChange);

    return () => mediaQuery.removeEventListener("change", handleSystemChange);
  }, [isHydrated, themePreference]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }
    document.documentElement.setAttribute("data-theme", currentTheme);
  }, [currentTheme, isHydrated]);

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        isHydrated,
        setThemePreference: handleSetThemePreference,
        themePreference,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};

export const ThemeModeStatus = () => {
  const locale = useLocale();
  const { currentTheme, isHydrated, setThemePreference, themePreference } =
    useTheme();

  const cycleTheme = useCallback(() => {
    setThemePreference((prev) => {
      switch (prev) {
        case "dark":
          return "light";
        case "light":
          return "system";
        default:
          return "dark";
      }
    });
  }, [setThemePreference]);

  const getThemeText = useCallback(() => {
    if (!isHydrated) {
      return "🌓 System";
    }
    if (themePreference === "system") {
      return `🌓 System (${currentTheme})`;
    }

    return themePreference === "dark" ? "🌙 Dark" : "☀️ Light";
  }, [currentTheme, themePreference, isHydrated]);

  if (!isHydrated) {
    return (
      <div className={`fixed flex ${locale === "fa" ? "left-0" : "right-0"}`}>
        <button>🌓 System</button>
      </div>
    );
  }

  return (
    <div className={`fixed flex ${locale === "fa" ? "left-0" : "right-0"}`}>
      <button onClick={cycleTheme}>{getThemeText()}</button>
    </div>
  );
};
