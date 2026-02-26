import type { PropsWithChildren } from "react";
import { Provider } from "react-redux";
import { store } from "@app/providers/store";

export function AppProviders({ children }: PropsWithChildren): JSX.Element {
  return <Provider store={store}>{children}</Provider>;
}
