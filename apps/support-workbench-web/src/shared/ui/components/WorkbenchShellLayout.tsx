import type { ReactNode } from "react";
import type { DensityMode } from "@shared/ui/contracts";

interface WorkbenchShellLayoutProps {
  readonly header: ReactNode;
  readonly nav: ReactNode;
  readonly main: ReactNode;
  readonly footer?: ReactNode;
  readonly density?: DensityMode;
}

export function WorkbenchShellLayout({
  header,
  nav,
  main,
  footer,
  density = "compact"
}: WorkbenchShellLayoutProps): JSX.Element {
  return (
    <div className={density === "compact" ? "shell-root shell-density-compact" : "shell-root shell-density-comfortable"}>
      {header}
      <div className="shell-body">
        {nav}
        {main}
      </div>
      {footer}
    </div>
  );
}
