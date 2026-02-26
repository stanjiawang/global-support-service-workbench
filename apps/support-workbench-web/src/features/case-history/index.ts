export const FEATURE_ID = "case-history" as const;

export interface case_history_ModuleContract {
  readonly featureId: typeof FEATURE_ID;
  readonly ownsRoute: true;
  readonly ownsStateSlice: true;
  readonly ownsApiAdapters: true;
  readonly ownsTestPlan: true;
}
