export interface DesignTokenContract {
  readonly colorTokensRequired: true;
  readonly typographyTokensRequired: true;
  readonly spacingTokensRequired: true;
  readonly motionTokensRequired: true;
}

export interface AccessiblePrimitiveContract {
  readonly roleSupportRequired: true;
  readonly keyboardContractRequired: true;
  readonly focusRingRequired: true;
  readonly ariaPatternTestRequired: true;
}
