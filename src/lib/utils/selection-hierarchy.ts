import { QueryClient } from '@tanstack/react-query';
import { Resource } from '@/lib/api/resources';
import { PaginatedResponse } from '@/lib/api/types';
import { resourcesQueryKeys } from '@/lib/query-keys/resources';

/**
 * Finds the parent directory of a given resource by traversing the resource hierarchy.
 *
 * @param queryClient - The React Query client to fetch data
 * @param connectionId - The connection ID
 * @param resourceId - The ID of the resource to find the parent for
 * @param currentPath - The current path being searched (used for recursive traversal)
 * @returns The parent resource if found, null otherwise
 */
export function findParentResource(
  queryClient: QueryClient,
  connectionId: string,
  resourceId: string,
  currentPath?: string
): Resource | null {
  const queryKey = resourcesQueryKeys.childrenWithParams(
    connectionId,
    currentPath
      ? {
          resource_id: currentPath,
        }
      : undefined
  );

  const childrenData =
    queryClient.getQueryData<PaginatedResponse<Resource>>(queryKey);

  if (!childrenData?.data) {
    return null;
  }

  // Check if the target resource is a direct child
  for (const resource of childrenData.data) {
    if (resource.resource_id === resourceId) {
      // Found the resource, return its parent (which would be the resource at currentPath)
      if (currentPath) {
        const parent = findResourceById(queryClient, connectionId, currentPath);
        return parent;
      }
      return null; // Resource is at root level
    }
  }

  // Recursively search in subdirectories
  for (const resource of childrenData.data) {
    if (resource.inode_type === 'directory') {
      const found = findParentResource(
        queryClient,
        connectionId,
        resourceId,
        resource.resource_id
      );
      if (found) {
        return found;
      }
    }
  }

  return null;
}

/**
 * Finds a resource by its ID by traversing the hierarchy.
 *
 * @param queryClient - The React Query client to fetch data
 * @param connectionId - The connection ID
 * @param resourceId - The ID of the resource to find
 * @param currentPath - The current path being searched (used for recursive traversal)
 * @returns The resource if found, null otherwise
 */
export function findResourceById(
  queryClient: QueryClient,
  connectionId: string,
  resourceId: string,
  currentPath?: string
): Resource | null {
  const queryKey = resourcesQueryKeys.childrenWithParams(
    connectionId,
    currentPath ? { resource_id: currentPath } : undefined
  );

  const childrenData =
    queryClient.getQueryData<PaginatedResponse<Resource>>(queryKey);

  if (!childrenData?.data) {
    return null;
  }

  // Check direct children
  for (const resource of childrenData.data) {
    if (resource.resource_id === resourceId) {
      return resource;
    }
  }

  // Recursively search in subdirectories
  for (const resource of childrenData.data) {
    if (resource.inode_type === 'directory') {
      const found = findResourceById(
        queryClient,
        connectionId,
        resourceId,
        resource.resource_id
      );
      if (found) {
        return found;
      }
    }
  }

  return null;
}

/**
 * Gets all sibling resources of a given resource (resources in the same directory).
 *
 * @param queryClient - The React Query client to fetch data
 * @param connectionId - The connection ID
 * @param resource - The resource to find siblings for
 * @param parentResourceId - The ID of the parent directory (optional)
 * @returns Array of sibling resources (excluding the resource itself)
 */
export function getSiblingResources(
  queryClient: QueryClient,
  connectionId: string,
  resource: Resource,
  parentResourceId?: string
): Resource[] {
  const queryKey = resourcesQueryKeys.childrenWithParams(connectionId, {
    resource_id: parentResourceId,
  });

  const childrenData =
    queryClient.getQueryData<PaginatedResponse<Resource>>(queryKey);

  if (!childrenData?.data) {
    return [];
  }

  return childrenData.data.filter(
    (sibling) => sibling.resource_id !== resource.resource_id
  );
}

/**
 * Recursively gets all child resource IDs for a given parent resource.
 * This is useful when selecting a directory and needing to deselect all its children.
 *
 * @param queryClient - The React Query client to fetch data
 * @param connectionId - The connection ID
 * @param parentResourceId - The ID of the parent resource to get children for
 * @returns Array of all descendant resource IDs
 */
export function getAllChildResourceIds(
  queryClient: QueryClient,
  connectionId: string,
  parentResourceId: string
): string[] {
  const childIds: string[] = [];

  const queryKey = resourcesQueryKeys.childrenWithParams(connectionId, {
    resource_id: parentResourceId,
  });

  const childrenData =
    queryClient.getQueryData<PaginatedResponse<Resource>>(queryKey);

  if (childrenData?.data) {
    for (const resource of childrenData.data) {
      childIds.push(resource.resource_id);

      // Recursively get children of folders
      if (resource.inode_type === 'directory') {
        childIds.push(
          ...getAllChildResourceIds(
            queryClient,
            connectionId,
            resource.resource_id
          )
        );
      }
    }
  }

  return childIds;
}
