import { expect, it, describe } from "vitest";
import { render } from "@testing-library/react";
import Home from "./page";

describe("Home", () => {
  it("should render home page", async () => {
    const { findByRole } = render(await Home());

    expect(
      await findByRole("heading", { level: 2, name: "Home" })
    ).toBeDefined();
  });
});
