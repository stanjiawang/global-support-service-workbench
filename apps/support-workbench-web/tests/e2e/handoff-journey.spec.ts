import { expect, test } from "@playwright/test";

test("agent completes chat -> phone -> case handoff journey", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "chat-session" }).click();
  await expect(page.getByRole("heading", { name: "chat-session" })).toBeVisible();
  await page.getByRole("button", { name: "Start handoff to phone" }).click();
  await expect(page.getByText("chat_queued")).toBeVisible();

  await page.getByRole("button", { name: "phone-session" }).click();
  await expect(page.getByRole("heading", { name: "phone-session" })).toBeVisible();
  await page.getByRole("button", { name: "Accept active handoff" }).click();
  await expect(page.getByText("phone_active")).toBeVisible();
  await page.getByRole("button", { name: "Escalate active handoff to case" }).click();
  await expect(page.getByText("case_opened")).toBeVisible();

  await page.getByRole("button", { name: "case-editor" }).click();
  await expect(page.getByRole("heading", { name: "case-editor" })).toBeVisible();
  await expect(page.getByText("case_opened")).toBeVisible();
  await page.getByRole("button", { name: "Apply handoff context" }).click();
  await page.getByRole("button", { name: "Save draft" }).click();
  await expect(page.getByText("Last saved")).toBeVisible();
});
