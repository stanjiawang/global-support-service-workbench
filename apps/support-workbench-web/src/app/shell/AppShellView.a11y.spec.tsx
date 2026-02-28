import { afterEach, describe, expect, it } from "vitest";
import { AppShellView } from "@app/shell/AppShellView";
import { renderWithStore } from "@shared/testing/renderWithStore";

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const selector = [
    "button",
    "[href]",
    "input",
    "select",
    "textarea",
    "[tabindex]:not([tabindex='-1'])"
  ].join(",");
  return Array.from(container.querySelectorAll<HTMLElement>(selector)).filter(
    (node) => !node.hasAttribute("disabled") && node.getAttribute("aria-hidden") !== "true"
  );
}

describe("AppShellView accessibility", () => {
  const cleanups: Array<() => void> = [];

  afterEach(() => {
    while (cleanups.length > 0) {
      const cleanup = cleanups.pop();
      cleanup?.();
    }
  });

  it("exposes labeled navigation and main landmark regions", () => {
    const { container, cleanup } = renderWithStore(<AppShellView />);
    cleanups.push(cleanup);

    const nav = container.querySelector("nav[aria-label='Feature navigation']");
    const main = container.querySelector("main[aria-live='polite']");

    expect(nav).not.toBeNull();
    expect(main).not.toBeNull();
  });

  it("uses native interactive elements and focusable controls", () => {
    const { container, cleanup } = renderWithStore(<AppShellView />);
    cleanups.push(cleanup);

    const rawInteractiveDivs = container.querySelectorAll("div[role='button'], div[onclick], div[tabindex]");
    expect(rawInteractiveDivs.length).toBe(0);

    const focusableElements = getFocusableElements(container);
    expect(focusableElements.length).toBeGreaterThan(0);

    const firstButton = container.querySelector<HTMLButtonElement>("button");
    expect(firstButton).not.toBeNull();
    firstButton?.focus();
    expect(document.activeElement).toBe(firstButton);
  });

  it("renders monochrome navigation icons with accessible labels", () => {
    const { container, cleanup } = renderWithStore(<AppShellView />);
    cleanups.push(cleanup);

    const navButtons = Array.from(container.querySelectorAll("nav[aria-label='Feature navigation'] button[aria-label]"));
    expect(navButtons.length).toBeGreaterThan(0);

    const routeButtons = navButtons.filter((button) => button.getAttribute("aria-label") !== "Collapse navigation");
    expect(routeButtons.length).toBeGreaterThan(0);

    for (const button of routeButtons.slice(0, 4)) {
      const icon = button.querySelector("svg[aria-hidden='true']");
      expect(icon).not.toBeNull();
      expect((button.getAttribute("aria-label") ?? "").length).toBeGreaterThan(0);
    }
  });
});
