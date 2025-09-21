'use client';

import { useConnectionResourcesChildren } from '@/hooks/queries/useResources';
import Resource from './Resource';
import { useGoogleDriveConnection } from '@/hooks/queries/useConnections';

type ResourcesListProps = {
  resourceId?: string;
  level?: number;
  parentFolderIds?: string[];
};

function ResourcesContent({
  resourceId,
  level = 0,
  parentFolderIds = [],
}: ResourcesListProps) {
  const { data: connection } = useGoogleDriveConnection();
  const { data: resources } = useConnectionResourcesChildren(
    connection.connection_id,
    resourceId ? { resource_id: resourceId } : undefined
  );

  if (!resources.data.length) {
    return (
      <p className="text-muted-foreground text-center">No resources found</p>
    );
  }

  return (
    <>
      {resources.data.map((resource) => (
        <Resource
          key={resource.resource_id}
          resource={resource}
          level={level}
          parentFolderIds={parentFolderIds}
        />
      ))}

      {resources.next_cursor && (
        <div className="border rounded-lg p-3 bg-muted/30">
          <p className="text-sm text-muted-foreground text-center">
            More resources available (pagination not implemented yet)
          </p>
        </div>
      )}
    </>
  );
}

export default function ResourcesList({
  resourceId,
  level = 0,
  parentFolderIds = [],
}: ResourcesListProps) {
  return (
    <ResourcesContent
      resourceId={resourceId}
      level={level}
      parentFolderIds={parentFolderIds}
    />
  );
}
