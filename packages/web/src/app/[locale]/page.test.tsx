import { render, screen } from "@testing-library/react"
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

describe("index", () => {
  it("should render index page", async () => {
    expect.assertions(1)

    render(await Home())

    await expect(
      screen.findByRole("heading", { level: 2, name: "Index" }),
    ).resolves.toBeDefined()
  })
})
