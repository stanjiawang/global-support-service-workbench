export interface AccessibleComponentContract {
  readonly semanticRoleRequired: true;
  readonly visibleFocusRequired: true;
  readonly ariaPatternTested: true;
}

export const ACCESSIBLE_COMPONENT_CONTRACT: AccessibleComponentContract = {
  semanticRoleRequired: true,
  visibleFocusRequired: true,
  ariaPatternTested: true
};
