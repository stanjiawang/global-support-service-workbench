export interface AppShellContract {
  readonly supportsKeyboardNavigation: true;
  readonly supportsFeatureFlags: true;
  readonly supportsErrorBoundaries: true;
}

export const APP_SHELL_CONTRACT: AppShellContract = {
  supportsKeyboardNavigation: true,
  supportsFeatureFlags: true,
  supportsErrorBoundaries: true
};
