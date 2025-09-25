"use client";

import { createContext } from "react";

type ThemeProviderProps = {
  children: React.ReactNode;
};

export const ThemeContext = createContext({});

export default function ThemeProvider({ children }: ThemeProviderProps) {
  return <ThemeContext.Provider value="dark">{children}</ThemeContext.Provider>;
}
