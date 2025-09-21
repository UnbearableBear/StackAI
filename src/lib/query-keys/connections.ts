export const connectionsQueryKeys = {
  all: () => ['connections'] as const,

  provider: (provider: string) =>
    [...connectionsQueryKeys.all(), provider] as const,

  withParams: (params?: { connection_provider?: string; limit?: number }) =>
    [...connectionsQueryKeys.all(), params] as const,

  gdrive: () => connectionsQueryKeys.provider('gdrive'),
};
