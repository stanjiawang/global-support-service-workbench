export type AppTheme = "light" | "dark" | "high-contrast";

export function applyTheme(theme: AppTheme): void {
  const root = document.documentElement;
  if (theme === "high-contrast") {
    root.setAttribute("data-theme", "light");
    root.setAttribute("data-contrast", "high");
    return;
  }

  root.setAttribute("data-theme", theme);
  root.removeAttribute("data-contrast");
}
