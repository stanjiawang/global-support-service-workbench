import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { InputField } from "@shared/ui/components/InputField";

describe("InputField", () => {
  it("always renders reserved error slot for zero-shift forms", () => {
    const html = renderToStaticMarkup(
      <InputField id="subject" label="Subject">
        <input id="subject" className="input-field" />
      </InputField>
    );
    expect(html).toContain("ux-field-error-slot");
  });

  it("renders error text inside reserved slot", () => {
    const html = renderToStaticMarkup(
      <InputField id="subject" label="Subject" error="Required field">
        <input id="subject" className="input-field" />
      </InputField>
    );
    expect(html).toContain("Required field");
  });
});
