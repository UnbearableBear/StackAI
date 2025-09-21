import { useSuspenseQuery } from '@tanstack/react-query';
import { listConnections, Connection } from '@/lib/api/connections';
import { connectionsQueryKeys } from '@/lib/query-keys/connections';

export const useGoogleDriveConnection = () => {
  return useSuspenseQuery({
    queryKey: connectionsQueryKeys.gdrive(),
    queryFn: () =>
      listConnections({
        connection_provider: 'gdrive',
        limit: 1,
      }),
    select: (data: Connection[]) => data[0], // Return first connection or undefined
  });
};

export const useConnections = (params?: {
  connection_provider?: string;
  limit?: number;
}) => {
  return useSuspenseQuery({
    queryKey: connectionsQueryKeys.withParams(params),
    queryFn: () => listConnections(params),
  });
};
