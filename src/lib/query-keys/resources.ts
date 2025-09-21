export const resourcesQueryKeys = {
  all: () => ['connections'] as const,

  connection: (connectionId: string) =>
    [...resourcesQueryKeys.all(), connectionId] as const,

  resources: (connectionId: string) =>
    [...resourcesQueryKeys.connection(connectionId), 'resources'] as const,

  resourcesWithParams: (
    connectionId: string,
    params?: { resource_id?: string }
  ) => [...resourcesQueryKeys.resources(connectionId), params] as const,

  children: (connectionId: string) =>
    [...resourcesQueryKeys.resources(connectionId), 'children'] as const,

  childrenWithParams: (
    connectionId: string,
    params?: { resource_id?: string }
  ) => [...resourcesQueryKeys.children(connectionId), params] as const,
};
