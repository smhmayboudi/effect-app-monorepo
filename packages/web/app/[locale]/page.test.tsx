import { expect, it, describe, vi } from "vitest";
import { render } from "@testing-library/react";
import Home from "./page";

vi.mock("next-intl/server", () => ({
  getTranslations: vi.fn().mockResolvedValue(
    (key: string) =>
      ({
        title: "Index",
      }[key] || key)
  ),
}));

describe("Index", () => {
  it("should render index page", async () => {
    const { findByRole } = render(await Home());

    expect(
      await findByRole("heading", { level: 2, name: "Index" })
    ).toBeDefined();
  });
});
