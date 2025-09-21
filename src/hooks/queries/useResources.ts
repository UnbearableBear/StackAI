import { useSuspenseQuery } from '@tanstack/react-query';
import {
  getConnectionResources,
  getConnectionResourcesChildren,
  Resource,
} from '@/lib/api/resources';
import { PaginatedResponse } from '@/lib/api/types';
import { resourcesQueryKeys } from '@/lib/query-keys/resources';

export const useConnectionResourcesChildren = (
  connectionId: string,
  params?: { resource_id?: string }
) => {
  return useSuspenseQuery<PaginatedResponse<Resource>>({
    queryKey: resourcesQueryKeys.childrenWithParams(connectionId, params),
    queryFn: () => getConnectionResourcesChildren(connectionId, params),
  });
};
