'use client';

import { Suspense, useState } from 'react';
import {
  FolderIcon,
  FolderOpenIcon,
  ChevronRightIcon,
  ChevronDownIcon,
} from 'lucide-react';
import { Resource } from '@/lib/api/resources';
import { useSelection } from '@/contexts/SelectionContext';
import ResourcesSkeleton from '@/components/ui/resources-skeleton';
import ResourcesList from './ResourceList';
import ResourceWrapper from './ResourceWrapper';
import { Checkbox } from '@/components/ui/checkbox';

type FolderResourceProps = {
  resource: Resource;
  level: number;
  parentFolderIds?: string[];
};

export default function FolderResource({
  resource,
  level,
  parentFolderIds = [],
}: FolderResourceProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { setSelected, deselect, isSelected } = useSelection();

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const isChecked = isSelected(resource, parentFolderIds);
  const handleSelectionToggle = (checked: boolean) => {
    checked ? setSelected(resource) : deselect(resource);
  };

  return (
    <div>
      <ResourceWrapper
        resource={resource}
        level={level}
        onClick={toggleExpanded}
        parentFolderIds={parentFolderIds}
      >
        <Checkbox
          checked={isChecked}
          onCheckedChange={handleSelectionToggle}
          onClick={(e) => e.stopPropagation()}
          className="flex-shrink-0 cursor-pointer"
        />
        {isExpanded ? (
          <ChevronDownIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        ) : (
          <ChevronRightIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        )}
        {isExpanded ? (
          <FolderOpenIcon className="h-5 w-5 text-muted-foreground flex-shrink-0" />
        ) : (
          <FolderIcon className="h-5 w-5 text-muted-foreground flex-shrink-0" />
        )}
      </ResourceWrapper>

      {isExpanded && (
        <Suspense fallback={<ResourcesSkeleton count={3} level={level + 1} />}>
          <ResourcesList
            resourceId={resource.resource_id}
            level={level + 1}
            parentFolderIds={[...parentFolderIds, resource.resource_id]}
          />
        </Suspense>
      )}
    </div>
  );
}
