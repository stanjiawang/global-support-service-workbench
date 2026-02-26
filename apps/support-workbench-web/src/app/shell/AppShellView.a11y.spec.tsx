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
});
