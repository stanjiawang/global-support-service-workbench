import { describe, expect, it } from "vitest";
import { statusFromValue, StatusType } from "@shared/ui/components/StatusBadge";

describe("DetailList badge mapping", () => {
  it("maps status/state variants to status types", () => {
    expect(statusFromValue("open")).toBe(StatusType.Open);
    expect(statusFromValue("pending")).toBe(StatusType.Pending);
    expect(statusFromValue("breached")).toBe(StatusType.Breached);
  });

  it("maps unknown values safely", () => {
    expect(statusFromValue("unknown-value")).toBe(StatusType.Unknown);
  });
});
