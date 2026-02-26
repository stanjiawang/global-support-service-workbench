export const FEATURE_ID = "agent-presence" as const;

export interface agent_presence_ModuleContract {
  readonly featureId: typeof FEATURE_ID;
  readonly ownsRoute: true;
  readonly ownsStateSlice: true;
  readonly ownsApiAdapters: true;
  readonly ownsTestPlan: true;
}
