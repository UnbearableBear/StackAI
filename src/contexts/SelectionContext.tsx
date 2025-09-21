'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Resource } from '@/lib/api/resources';
import { useQueryClient } from '@tanstack/react-query';
import { connectionsQueryKeys } from '@/lib/query-keys/connections';
import { Connection } from '@/lib/api/connections';
import {
  traverseToSelectedAncestor,
  calculateSelectionChanges,
} from '@/lib/utils/ancestor-traversal';
import { getAllChildResourceIds } from '@/lib/utils/selection-hierarchy';

type SelectionContextType = {
  selectedResources: Set<string>;
  isSelected: (resource: Resource, parentFolderIds?: string[]) => boolean;
  setSelected: (resource: Resource) => void;
  deselect: (resource: Resource) => void;
  clearSelection: () => void;
  getSelectedResourcesList: () => string[];
  setSelectedResources: (resourceIds: string[]) => void;
};

const SelectionContext = createContext<SelectionContextType | undefined>(
  undefined
);

export const useSelection = () => {
  const context = useContext(SelectionContext);
  if (!context) {
    throw new Error('useSelection must be used within a SelectionProvider');
  }
  return context;
};

type SelectionProviderProps = {
  children: React.ReactNode;
};

export const SelectionProvider: React.FC<SelectionProviderProps> = ({
  children,
}) => {
  const [selectedResources, setSelectedResourcesState] = useState<Set<string>>(
    new Set()
  );
  const queryClient = useQueryClient();

  const isSelected = (resource: Resource, parentFolderIds?: string[]) => {
    // First check if the resource itself is selected
    if (selectedResources.has(resource.resource_id)) {
      return true;
    }

    // If there are parent folders, check if any parent is selected
    if (parentFolderIds && parentFolderIds.length > 0) {
      for (const parentId of parentFolderIds) {
        if (selectedResources.has(parentId)) {
          return true;
        }
      }
    }

    return false;
  };

  const clearSelection = useCallback(() => {
    setSelectedResourcesState(new Set());
  }, []);

  const getSelectedResourcesList = useCallback(() => {
    return Array.from(selectedResources);
  }, [selectedResources]);

  const setSelectedResources = useCallback((resourceIds: string[]) => {
    setSelectedResourcesState(new Set(resourceIds));
  }, []);

  const setSelected = useCallback(
    (resource: Resource) => {
      setSelectedResourcesState((prev) => {
        const newSelected = new Set(prev);

        if (newSelected.has(resource.resource_id)) {
          return prev; // Already selected, no change
        }

        newSelected.add(resource.resource_id);

        // If this is a directory, remove all its children from selection
        if (resource.inode_type === 'directory') {
          // Get the gdrive connection to extract connectionId
          const gdriveConnection = queryClient.getQueryData<Connection[]>(
            connectionsQueryKeys.gdrive()
          );
          const connectionId = gdriveConnection?.[0]?.connection_id;
          if (connectionId) {
            const childIds = getAllChildResourceIds(
              queryClient,
              connectionId,
              resource.resource_id
            );
            childIds.forEach((childId) => {
              newSelected.delete(childId);
            });
          }
        }

        return newSelected;
      });
    },
    [queryClient]
  );

  const deselect = useCallback(
    (resource: Resource) => {
      setSelectedResourcesState((prev) => {
        const newSelected = new Set(prev);

        // If the resource is directly selected, simply remove it
        if (newSelected.has(resource.resource_id)) {
          newSelected.delete(resource.resource_id);
          return newSelected;
        }

        // If the resource is not directly selected but appears selected due to an ancestor,
        // we need to traverse up the hierarchy to find the selected ancestor and handle
        // the complex deselection logic
        const driveConnection = queryClient.getQueryData<Connection[]>(
          connectionsQueryKeys.gdrive()
        );
        const connectionId = driveConnection?.[0]?.connection_id;

        if (!connectionId) {
          // If we can't get the connection ID, just return the current state unchanged
          console.warn('Cannot deselect: no connection ID found');
          return prev;
        }

        // Traverse up the hierarchy to find the selected ancestor
        const traversalPath = traverseToSelectedAncestor(
          queryClient,
          connectionId,
          resource,
          newSelected
        );

        // If no traversal path found, the resource might not be indirectly selected
        if (traversalPath.length === 0) {
          console.warn(
            'No traversal path found for resource:',
            resource.resource_id
          );
          return prev;
        }

        // Calculate what needs to be selected and deselected
        const { toSelect, toDeselect } = calculateSelectionChanges(
          traversalPath,
          resource.resource_id
        );

        // Apply the deselection changes
        toDeselect.forEach((resourceId) => {
          newSelected.delete(resourceId);
        });

        // Apply the selection changes (siblings and ancestors that need to remain selected)
        toSelect.forEach((resourceId) => {
          newSelected.add(resourceId);
        });

        return newSelected;
      });
    },
    [queryClient]
  );

  const value: SelectionContextType = {
    selectedResources,
    isSelected,
    setSelected,
    deselect,
    clearSelection,
    getSelectedResourcesList,
    setSelectedResources,
  };

  return (
    <SelectionContext.Provider value={value}>
      {children}
    </SelectionContext.Provider>
  );
};
