export interface EventEnvelope {
  readonly eventId: string;
  readonly entityId: string;
  readonly channel: "chat" | "phone" | "case";
  readonly version: number;
  readonly serverTs: string;
}

export interface PaginationContract {
  readonly cursor?: string;
  readonly pageSize: number;
}

export interface ApiVersionContract {
  readonly apiVersion: string;
  readonly schemaVersion: string;
}
