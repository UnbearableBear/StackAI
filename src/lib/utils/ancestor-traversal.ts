import { QueryClient } from '@tanstack/react-query';
import { Resource } from '@/lib/api/resources';
import { findParentResource, getSiblingResources } from './selection-hierarchy';

/**
 * Represents a step in the ancestor traversal process.
 */
export interface TraversalStep {
  resource: Resource;
  parent?: Resource;
  siblings: Resource[];
  level: number;
}

/**
 * Traverses up the ancestor hierarchy starting from a given resource until it finds
 * a selected ancestor. Returns the path taken during traversal.
 *
 * This function is used when we need to deselect a file that appears selected
 * because one of its ancestors is selected. We traverse up the hierarchy to find
 * the selected ancestor, and along the way we collect siblings that need to be
 * explicitly selected to maintain the same selection state after deselecting
 * the ancestor.
 *
 * @param queryClient - The React Query client to fetch data
 * @param connectionId - The connection ID
 * @param startResource - The resource to start traversal from
 * @param selectedResources - Set of currently selected resource IDs
 * @returns Array of traversal steps from the start resource to the selected ancestor
 */
export function traverseToSelectedAncestor(
  queryClient: QueryClient,
  connectionId: string,
  startResource: Resource,
  selectedResources: Set<string>
): TraversalStep[] {
  const traversalPath: TraversalStep[] = [];
  let currentResource = startResource;
  let level = 0;

  while (true) {
    // Find the parent of the current resource
    const parentResource = findParentResource(
      queryClient,
      connectionId,
      currentResource.resource_id
    );

    // Get siblings of the current resource
    const siblings = getSiblingResources(
      queryClient,
      connectionId,
      currentResource,
      parentResource?.resource_id
    );

    // Create traversal step
    const step: TraversalStep = {
      resource: currentResource,
      parent: parentResource || undefined,
      siblings,
      level,
    };

    traversalPath.push(step);

    // Check if parent is selected (this is what we're looking for)
    if (parentResource && selectedResources.has(parentResource.resource_id)) {
      // Parent is selected, add one more step for the parent and we're done
      const parentSiblings = getSiblingResources(
        queryClient,
        connectionId,
        parentResource,
        findParentResource(
          queryClient,
          connectionId,
          parentResource.resource_id
        )?.resource_id
      );

      const parentStep: TraversalStep = {
        resource: parentResource,
        parent:
          findParentResource(
            queryClient,
            connectionId,
            parentResource.resource_id
          ) || undefined,
        siblings: parentSiblings,
        level: level + 1,
      };

      traversalPath.push(parentStep);
      break;
    }

    // If no parent, we've reached the root without finding a selected ancestor
    if (!parentResource) {
      break;
    }

    // Move up to parent for next iteration
    currentResource = parentResource;
    level++;
  }

  return traversalPath;
}

/**
 * Calculates which resources need to be selected and which need to be deselected
 * based on an ancestor traversal path.
 *
 * When deselecting a resource that appears selected due to an ancestor being selected,
 * we need to:
 * 1. Deselect the selected ancestor
 * 2. Select all siblings of resources in the traversal path (except the path we're deselecting)
 *
 * @param traversalPath - The path returned by traverseToSelectedAncestor
 * @param targetResourceId - The ID of the resource we originally wanted to deselect
 * @returns Object with resources to select and deselect
 */
export function calculateSelectionChanges(
  traversalPath: TraversalStep[],
  targetResourceId: string
): {
  toSelect: string[];
  toDeselect: string[];
} {
  const toSelect: string[] = [];
  const toDeselect: string[] = [targetResourceId];

  // Find the selected ancestor (should be the last item in the path)
  const selectedAncestor = traversalPath[traversalPath.length - 1];
  toDeselect.push(selectedAncestor.resource.resource_id);

  // For each step in the traversal (except the last selected ancestor),
  // we need to deselect the parent and select all siblings to maintain
  // the same selection state
  for (let i = traversalPath.length - 2; i >= 0; i--) {
    const step = traversalPath[i];

    // Deselect the resource at this step
    if (step.resource.resource_id !== targetResourceId) {
      toDeselect.push(step.resource.resource_id);
    }

    // Select all siblings at this level
    step.siblings.forEach((sibling) => {
      toSelect.push(sibling.resource_id);
    });
  }

  return { toSelect, toDeselect };
}
