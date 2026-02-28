import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { DataTable } from "@shared/ui/DataTable";

interface Row {
  readonly id: string;
  readonly name: string;
}

const columns = [
  { key: "name", header: "Name", render: (row: Row): string => row.name }
] as const;

describe("DataTable loading stability", () => {
  it("renders reserved skeleton rows while loading", () => {
    const html = renderToStaticMarkup(
      <DataTable<Row>
        columns={columns}
        rows={[]}
        getRowKey={(row) => row.id}
        emptyMessage="none"
        loading
        skeletonRowCount={3}
        reservedMinHeightPx={220}
      />
    );

    expect(html).toContain("ux-skeleton");
    expect(html).toContain("min-height:220px");
  });

  it("renders row content when not loading", () => {
    const html = renderToStaticMarkup(
      <DataTable<Row>
        columns={columns}
        rows={[{ id: "1", name: "Ava" }]}
        getRowKey={(row) => row.id}
        emptyMessage="none"
      />
    );

    expect(html).toContain("Ava");
  });

  it("renders pagination controls when enabled with multiple pages", () => {
    const html = renderToStaticMarkup(
      <DataTable<Row>
        columns={columns}
        rows={[
          { id: "1", name: "Ava" },
          { id: "2", name: "Noah" },
          { id: "3", name: "Mia" }
        ]}
        getRowKey={(row) => row.id}
        emptyMessage="none"
        paginate
        pageSize={2}
        paginationLabel="People"
      />
    );

    expect(html).toContain("Previous page");
    expect(html).toContain("Next page");
    expect(html).toContain("Page 1 / 2");
  });

  it("auto-paginates long tables when pageSize is exceeded", () => {
    const html = renderToStaticMarkup(
      <DataTable<Row>
        columns={columns}
        rows={[
          { id: "1", name: "Ava" },
          { id: "2", name: "Noah" },
          { id: "3", name: "Mia" }
        ]}
        getRowKey={(row) => row.id}
        emptyMessage="none"
        pageSize={2}
      />
    );

    expect(html).toContain("Page 1 / 2");
  });
});
