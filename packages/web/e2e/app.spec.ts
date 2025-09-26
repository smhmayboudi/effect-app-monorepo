import { test, expect } from "@playwright/test";

test("should navigate to the index page", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL("/en");
  await page.goto("/en");
  await expect(page.locator("h2")).toContainText("Index");
});
