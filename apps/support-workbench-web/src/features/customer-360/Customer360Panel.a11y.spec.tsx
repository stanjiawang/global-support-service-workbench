import { afterEach, describe, expect, it, vi } from "vitest";
import { Customer360Panel } from "@features/customer-360/Customer360Panel";
import { renderWithStore } from "@shared/testing/renderWithStore";

describe("Feature panel accessibility contracts", () => {
  const cleanups: Array<() => void> = [];

  afterEach(() => {
    while (cleanups.length > 0) {
      const cleanup = cleanups.pop();
      cleanup?.();
    }
  });

  it("customer-360 panel has labeled simulator controls and accessible button labels", () => {
    const { container, cleanup } = renderWithStore(<Customer360Panel onRefreshAll={vi.fn()} />);
    cleanups.push(cleanup);

    const group = container.querySelector("[role='group'][aria-label='Event simulator controls']");
    expect(group).not.toBeNull();

    const simulatorButtons = container.querySelectorAll("button");
    expect(simulatorButtons.length).toBeGreaterThanOrEqual(7);

    for (const button of simulatorButtons) {
      expect(button.textContent?.trim().length ?? 0).toBeGreaterThan(0);
    }
  });
});
