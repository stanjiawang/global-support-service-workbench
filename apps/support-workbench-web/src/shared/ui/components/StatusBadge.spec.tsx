import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { StatusBadge, StatusType, statusFromValue } from "@shared/ui/components/StatusBadge";

describe("StatusBadge", () => {
  it("maps status values to typed statuses", () => {
    expect(statusFromValue("open")).toBe(StatusType.Open);
    expect(statusFromValue("at-risk")).toBe(StatusType.AtRisk);
    expect(statusFromValue("ok")).toBe(StatusType.Healthy);
    expect(statusFromValue("succeeded")).toBe(StatusType.Ready);
    expect(statusFromValue("warning")).toBe(StatusType.AtRisk);
    expect(statusFromValue("pass")).toBe(StatusType.Healthy);
    expect(statusFromValue("unknown-state")).toBe(StatusType.Unknown);
  });

  it("defaults critical statuses to solid variant", () => {
    const html = renderToStaticMarkup(<StatusBadge status={StatusType.Breached} />);
    expect(html).toContain("status-solid");
  });

  it("keeps fixed-width and centered geometry", () => {
    const html = renderToStaticMarkup(<StatusBadge status={StatusType.Pending} />);
    expect(html).toContain("badge-base");
  });

  it("provides accessible aria label", () => {
    const html = renderToStaticMarkup(<StatusBadge status={StatusType.Open} />);
    expect(html).toContain('aria-label="Status: Open"');
  });
});
