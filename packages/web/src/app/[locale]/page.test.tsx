import { render, screen } from "@testing-library/react"
import { NextIntlClientProvider } from "next-intl"
import { describe, expect, it, vi } from "vitest"

import Home from "./page"

vi.mock(import("next-intl/server"), () => ({
  getTranslations: vi.fn().mockResolvedValue(
    (key: string) =>
      ({
        title: "Index",
      })[key] || key,
  ),
}))

function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <NextIntlClientProvider
      locale="en"
      messages={{}}
      timeZone="UTC"
    >
      {children}
    </NextIntlClientProvider>
  )
}

describe("index", () => {
  it("should render index page", async () => {
    expect.assertions(1)

    render(<TestWrapper>{await Home()}</TestWrapper>)

    await expect(
      screen.findByRole("heading", { level: 1 }),
    ).resolves.toBeDefined()
  })
})
