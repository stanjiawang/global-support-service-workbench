import { AppProviders } from "@app/providers/AppProviders";
import { AppShellView } from "@app/shell/AppShellView";

export function App(): JSX.Element {
  return (
    <AppProviders>
      <AppShellView />
    </AppProviders>
  );
}
