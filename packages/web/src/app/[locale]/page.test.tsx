import Home from "./page";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next-intl/server", () => ({
  getTranslations: vi.fn().mockResolvedValue(
    (key: string) =>
      ({
        title: "Index",
      })[key] || key,
  ),
}));

describe("Index", () => {
  it("should render index page", async () => {
    render(await Home());

    expect(
      await screen.findByRole("heading", { level: 2, name: "Index" }),
    ).toBeDefined();
  });
});
