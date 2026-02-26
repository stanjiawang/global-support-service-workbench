export const FEATURE_ID = "knowledge-assist" as const;

export interface knowledge_assist_ModuleContract {
  readonly featureId: typeof FEATURE_ID;
  readonly ownsRoute: true;
  readonly ownsStateSlice: true;
  readonly ownsApiAdapters: true;
  readonly ownsTestPlan: true;
}
