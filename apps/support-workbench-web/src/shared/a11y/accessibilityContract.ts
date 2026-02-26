export interface AccessibilityContract {
  readonly wcagTarget: "2.1-AA";
  readonly keyboardOnlyPathRequired: true;
  readonly screenReaderSupportRequired: true;
  readonly noRawInteractiveDiv: true;
}

export const ACCESSIBILITY_CONTRACT: AccessibilityContract = {
  wcagTarget: "2.1-AA",
  keyboardOnlyPathRequired: true,
  screenReaderSupportRequired: true,
  noRawInteractiveDiv: true
};
