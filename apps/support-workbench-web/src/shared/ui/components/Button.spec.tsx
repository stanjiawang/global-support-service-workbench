import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Button } from "@shared/ui/components/Button";

describe("Button", () => {
  it("renders semantic button markup", () => {
    const html = renderToStaticMarkup(<Button>Save</Button>);
    expect(html).toContain("<button");
    expect(html).toContain(">Save</button>");
  });

  it("applies apple-spring motion class", () => {
    const html = renderToStaticMarkup(<Button>Continue</Button>);
    expect(html).toContain("apple-spring");
  });

  it("keeps disabled passthrough behavior", () => {
    const onClick = vi.fn();
    const html = renderToStaticMarkup(
      <Button disabled onClick={onClick}>
        Disabled
      </Button>
    );
    expect(html).toContain("disabled");
  });

  it("keeps focus-visible ring utility classes", () => {
    const html = renderToStaticMarkup(<Button>Focus</Button>);
    expect(html).toContain("focus-visible:ring-2");
  });
});
