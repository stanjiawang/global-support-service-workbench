export const FEATURE_ID = "phone-session" as const;

export interface phone_session_ModuleContract {
  readonly featureId: typeof FEATURE_ID;
  readonly ownsRoute: true;
  readonly ownsStateSlice: true;
  readonly ownsApiAdapters: true;
  readonly ownsTestPlan: true;
}
