'use client';

import { Resource as ResourceType } from '@/lib/api/resources';
import FileResource from './FileResource';
import FolderResource from './FolderResource';

type ResourceProps = {
  resource: ResourceType;
  level: number;
  parentFolderIds?: string[];
};

export default function Resource({
  resource,
  level,
  parentFolderIds,
}: ResourceProps) {
  if (resource.inode_type === 'directory') {
    return (
      <FolderResource
        resource={resource}
        level={level}
        parentFolderIds={parentFolderIds}
      />
    );
  }

  return (
    <FileResource
      resource={resource}
      level={level}
      parentFolderIds={parentFolderIds}
    />
  );
}
