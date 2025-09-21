'use client';

import { FileIcon } from 'lucide-react';
import { Resource } from '@/lib/api/resources';
import { useSelection } from '@/contexts/SelectionContext';
import ResourceWrapper from './ResourceWrapper';
import { Checkbox } from '@/components/ui/checkbox';

type FileResourceProps = {
  resource: Resource;
  level: number;
  parentFolderIds?: string[];
};

export default function FileResource({
  resource,
  level,
  parentFolderIds,
}: FileResourceProps) {
  const { setSelected, deselect, isSelected } = useSelection();

  const isChecked = isSelected(resource, parentFolderIds);

  const handleSelectionToggle = () => {
    isChecked ? deselect(resource) : setSelected(resource);
  };

  return (
    <ResourceWrapper
      resource={resource}
      level={level}
      parentFolderIds={parentFolderIds}
      onClick={handleSelectionToggle}
    >
      <Checkbox checked={isChecked} className="flex-shrink-0 cursor-pointer" />
      <FileIcon className="h-5 w-5 text-muted-foreground flex-shrink-0" />
    </ResourceWrapper>
  );
}
