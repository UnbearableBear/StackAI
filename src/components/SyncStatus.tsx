'use client';

import { CircleAlert, CircleCheck } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useSelection } from '@/contexts/SelectionContext';
import { useKnowledgeBaseIdQueryParameter } from '@/hooks/useKnowledgeBaseIdQueryParameter';
import { useKnowledgeBase } from '@/hooks/queries/useKnowledgeBase';
import { Resource } from '@/lib/api/resources';

type SyncStatusProps = {
  resource: Resource;
  parentFolderIds?: string[];
};

export default function SyncStatus({
  resource,
  parentFolderIds,
}: SyncStatusProps) {
  const { isSelected } = useSelection();
  const { knowledgeBaseId } = useKnowledgeBaseIdQueryParameter();
  const { data: knowledgeBase } = useKnowledgeBase(knowledgeBaseId);

  // Don't show status for folders
  if (resource.inode_type === 'directory') {
    return null;
  }

  // If there's no knowledge base, don't show sync status
  if (!knowledgeBaseId || !knowledgeBase) {
    return null;
  }

  // Check if resource ID is in connection_source_ids
  const isResourceInKB = knowledgeBase.connection_source_ids.includes(
    resource.resource_id
  );

  // Check if any parent folder ID is in connection_source_ids
  const isParentFolderInKB =
    parentFolderIds?.some((folderId) =>
      knowledgeBase.connection_source_ids.includes(folderId)
    ) || false;

  const isInKnowledgeBase = isResourceInKB || isParentFolderInKB;
  const isResourceSelected = isSelected(resource, parentFolderIds);

  // Only show status if resource is selected OR if it's in the knowledge base
  if (!isResourceSelected && !isInKnowledgeBase) {
    return null;
  }

  // Determine icon and styling based on whether resource or parent is in knowledge base

  const {
    icon: Icon,
    iconColor,
    tooltip,
  } = isInKnowledgeBase && isResourceSelected
    ? {
        icon: CircleCheck,
        iconColor: 'text-green-600',
        tooltip: 'In knowledge base',
      }
    : isInKnowledgeBase && !isResourceSelected
      ? {
          icon: CircleAlert,
          iconColor: 'text-yellow-600',
          tooltip: 'Still in knowledge base',
        }
      : {
          icon: CircleAlert,
          iconColor: 'text-red-600',
          tooltip: 'Not in knowledge base yet',
        };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Icon className={`h-6 w-6 flex-shrink-0 ${iconColor}`} />
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
