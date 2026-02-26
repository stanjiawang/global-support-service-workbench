export interface AuthSessionContract {
  readonly tokenType: "Bearer";
  readonly expiresAtEpochMs: number;
  readonly scopes: readonly string[];
}
