import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { InteractiveCard } from "@shared/ui/components/InteractiveCard";

describe("InteractiveCard", () => {
  it("renders a semantic button in interactive mode", () => {
    const html = renderToStaticMarkup(<InteractiveCard onClick={vi.fn()}>Action card</InteractiveCard>);
    expect(html).toContain("<button");
    expect(html).toContain("type=\"button\"");
  });

  it("renders a non-interactive div when no click handler is provided", () => {
    const html = renderToStaticMarkup(<InteractiveCard>Static card</InteractiveCard>);
    expect(html).toContain("<div");
    expect(html).not.toContain("<button");
  });

  it("applies apple-spring only in interactive mode", () => {
    const interactiveHtml = renderToStaticMarkup(<InteractiveCard onClick={vi.fn()}>Interactive</InteractiveCard>);
    const staticHtml = renderToStaticMarkup(<InteractiveCard>Static</InteractiveCard>);
    expect(interactiveHtml).toContain("apple-spring");
    expect(staticHtml).not.toContain("apple-spring");
  });
});
