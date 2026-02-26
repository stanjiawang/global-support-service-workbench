import type { PropsWithChildren, ReactElement } from "react";
import { Provider } from "react-redux";
import { createRoot, type Root } from "react-dom/client";
import { act } from "react";
import { createWorkbenchStore, type WorkbenchStore } from "@app/providers/store";

interface RenderWithStoreResult {
  readonly container: HTMLDivElement;
  readonly store: WorkbenchStore;
  cleanup: () => void;
}

function Wrapper({
  store,
  children
}: PropsWithChildren<{
  readonly store: WorkbenchStore;
}>): JSX.Element {
  return (
    <Provider store={store} stabilityCheck="never" identityFunctionCheck="never">
      {children}
    </Provider>
  );
}

export function renderWithStore(
  element: ReactElement,
  options?: {
    readonly store?: WorkbenchStore;
  }
): RenderWithStoreResult {
  const store = options?.store ?? createWorkbenchStore();
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root: Root = createRoot(container);

  act(() => {
    root.render(<Wrapper store={store}>{element}</Wrapper>);
  });

  return {
    container,
    store,
    cleanup: () => {
      act(() => {
        root.unmount();
      });
      container.remove();
    }
  };
}
