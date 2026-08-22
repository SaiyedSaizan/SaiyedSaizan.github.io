import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("portfolio exposes the core recruiter journey", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toContainText("check");
  await expect(page.getByRole("link", { name: /Inspect Flow/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Agent Governance Runtime/i })).toBeAttached();
  await expect(page.getByRole("link", { name: /Résumé/i }).first()).toHaveAttribute(
    "href",
    "/Saiyed-Saizan-Shahnawaz-Resume.pdf?v=2026-08-14",
  );

  await page.keyboard.press("Slash");
  await expect(page.getByRole("dialog", { name: /Command menu/i })).toBeVisible();
  await page.getByRole("textbox", { name: /Search commands/i }).fill("Flow");
  await expect(page.getByRole("option", { name: /Inspect Flow/i })).toBeVisible();
  await page.keyboard.press("Escape");
});

test("Flow trace is operable without autoplay", async ({ page }) => {
  await page.goto("/#flow-lab");
  const step = page.getByRole("button", { name: /^Step/i });
  for (let index = 0; index < 7; index += 1) await step.click();
  await expect(page.getByText(/stops short of clearing you for the course/)).toBeVisible();
});

test("mobile navigation fits the viewport", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  await page.getByRole("button", { name: /Open navigation menu/i }).click();
  await expect(page.getByRole("link", { name: /Flow/ }).last()).toBeVisible();
  await expect(page.locator(".hero-core canvas")).toHaveCount(0);
  const layout = await page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth - window.innerWidth,
    offenders: [...document.querySelectorAll<HTMLElement>("body *")]
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          tag: element.tagName,
          className: element.className.toString().slice(0, 100),
          left: Math.round(rect.left),
          right: Math.round(rect.right),
          width: Math.round(rect.width),
        };
      })
      .filter((item) => item.right > window.innerWidth + 1 || item.left < -1)
      .slice(0, 12),
  }));
  expect(layout.overflow, JSON.stringify(layout.offenders, null, 2)).toBeLessThanOrEqual(1);
});

test("page has no automated WCAG A/AA violations", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += 700) {
    await page.evaluate((position) => window.scrollTo(0, position), y);
    await page.waitForTimeout(20);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
});
