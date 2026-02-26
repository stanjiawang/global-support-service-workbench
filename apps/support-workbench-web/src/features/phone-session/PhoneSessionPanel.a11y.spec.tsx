import { afterEach, describe, expect, it } from "vitest";
import { PhoneSessionPanel } from "@features/phone-session/PhoneSessionPanel";
import { renderWithStore } from "@shared/testing/renderWithStore";

describe("phone-session accessibility contracts", () => {
  const cleanups: Array<() => void> = [];

  afterEach(() => {
    while (cleanups.length > 0) {
      const cleanup = cleanups.pop();
      cleanup?.();
    }
  });

  it("uses labeled controls and keyboard-focusable buttons", () => {
    const { container, cleanup } = renderWithStore(<PhoneSessionPanel />);
    cleanups.push(cleanup);

    const controlsGroup = container.querySelector("[role='group'][aria-label='Phone session controls']");
    expect(controlsGroup).not.toBeNull();

    const buttons = Array.from(container.querySelectorAll<HTMLButtonElement>("button"));
    expect(buttons.length).toBeGreaterThanOrEqual(3);
    for (const button of buttons) {
      expect(button.textContent?.trim().length ?? 0).toBeGreaterThan(0);
    }

    const firstControl = buttons[0];
    expect(firstControl).toBeDefined();
    firstControl?.focus();
    expect(document.activeElement).toBe(firstControl);
  });
});
