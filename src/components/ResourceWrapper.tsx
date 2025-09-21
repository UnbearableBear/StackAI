'use client';

import { Resource } from '@/lib/api/resources';
import SyncStatus from './SyncStatus';

type ResourceWrapperProps = {
  resource: Resource;
  level: number;
  onClick?: () => void;
  children: React.ReactNode;
  parentFolderIds?: string[];
};

export default function ResourceWrapper({
  resource,
  level,
  onClick,
  children,
  parentFolderIds,
}: ResourceWrapperProps) {
  return (
    <div
      className={`flex items-center gap-3 p-3 transition-colors duration-200 rounded-md hover:bg-accent cursor-pointer`}
      onClick={onClick}
      style={{ paddingLeft: `${12 + level * 24}px` }}
    >
      {children}
      <div className="flex-1 min-w-0 truncate">
        {resource.inode_path.path.split('/').pop() || resource.inode_path.path}
      </div>
      <SyncStatus resource={resource} parentFolderIds={parentFolderIds} />
    </div>
  );
}
