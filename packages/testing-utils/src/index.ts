export interface TestGateContract {
  readonly unitCoverageThreshold: number;
  readonly mutationCoverageThreshold: number;
  readonly a11yGateEnabled: boolean;
}

export const DEFAULT_TEST_GATES: TestGateContract = {
  unitCoverageThreshold: 0.85,
  mutationCoverageThreshold: 0.7,
  a11yGateEnabled: true
};
