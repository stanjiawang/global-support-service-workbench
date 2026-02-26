export const FEATURE_ID = "case-editor" as const;

export interface case_editor_ModuleContract {
  readonly featureId: typeof FEATURE_ID;
  readonly ownsRoute: true;
  readonly ownsStateSlice: true;
  readonly ownsApiAdapters: true;
  readonly ownsTestPlan: true;
}
