import { describe, expect, it } from "vitest";
import { UI_TOKENS } from "@shared/ui/tokens";

describe("UI_TOKENS hard-rule scale", () => {
  it("keeps compact input density and strict typography tokens", () => {
    expect(UI_TOKENS.radius.input).toBe("8px");
    expect(UI_TOKENS.typography.title).toContain("tracking-tight");
    expect(UI_TOKENS.typography.subtitle).toContain("leading-relaxed");
  });

  it("keeps 8pt-based spacing anchors", () => {
    expect(UI_TOKENS.spacing.xs).toBe("4px");
    expect(UI_TOKENS.spacing.sm).toBe("8px");
    expect(UI_TOKENS.spacing.md).toBe("16px");
  });

  it("exposes zero-shift interaction and layout contracts", () => {
    expect(UI_TOKENS.interactive.zeroShiftBorder).toContain("ux-zero-shift-border");
    expect(UI_TOKENS.layout.iconSlot).toContain("ux-icon-slot");
    expect(UI_TOKENS.layout.fieldErrorSlot).toContain("ux-field-error-slot");
  });
});
