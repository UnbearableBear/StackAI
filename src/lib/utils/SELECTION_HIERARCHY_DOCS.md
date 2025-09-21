# Selection Hierarchy Documentation

This document explains the complex logic behind hierarchical resource selection and deselection in the StackAI application.

## Overview

The selection system handles two main scenarios:
1. **Direct Selection**: A resource is explicitly selected by the user
2. **Inherited Selection**: A resource appears selected because one of its ancestors (parent folders) is selected

The complexity arises when trying to **deselect a resource that is not directly selected** but appears selected due to an ancestor being selected.

## The Problem

Consider this folder structure:
```
📁 ProjectRoot (selected)
├── 📁 src
│   ├── 📄 index.js (appears selected due to ProjectRoot)
│   └── 📄 utils.js (appears selected due to ProjectRoot)
├── 📁 docs
│   └── 📄 README.md (appears selected due to ProjectRoot)
└── 📄 package.json (appears selected due to ProjectRoot)
```

If a user wants to deselect `index.js`, we can't simply remove it from the selection set because it was never directly selected. Instead, we need to:

1. **Deselect the ancestor** (`ProjectRoot`) that was causing it to be selected
2. **Select all the siblings and other resources** that should remain selected to maintain the same visual state

## The Solution

### Step 1: Ancestor Traversal

Starting from the target resource (`index.js`), we traverse up the hierarchy until we find the selected ancestor (`ProjectRoot`):

```
Path: index.js → src → ProjectRoot (✓ selected)
```

### Step 2: Sibling Collection

At each level of traversal, we collect the siblings:
- At `index.js` level: `utils.js` (sibling)
- At `src` level: `docs`, `package.json` (siblings)

### Step 3: Selection Calculation

To deselect `index.js` while maintaining the same visual selection state:
- **Unselect**: `ProjectRoot`
- **Select**: `utils.js`, `src` (excluding `index.js`), `docs`, `package.json`

Result:
```
📁 ProjectRoot (deselected)
├── 📁 src (selected)
│   ├── 📄 index.js (deselected - our target)
│   └── 📄 utils.js (selected)
├── 📁 docs (selected)
│   └── 📄 README.md (appears selected due to docs)
└── 📄 package.json (selected)
```

## Implementation Components

### 1. `selection-hierarchy.ts`

Contains utility functions for navigating the resource hierarchy:

- **`findParentResource`**: Locates the parent directory of a given resource
- **`findResourceById`**: Finds a resource by its ID in the hierarchy
- **`getSiblingResources`**: Gets all resources at the same level (siblings)

### 2. `ancestor-traversal.ts`

Contains the core algorithm for ancestor traversal:

- **`traverseToSelectedAncestor`**: Traverses up the hierarchy to find the selected ancestor
  - Returns a `TraversalStep[]` representing the path taken
  - Each step contains the resource, its parent, siblings, and level information

- **`calculateSelectionChanges`**: Determines what resources to select/deselect
  - Takes the traversal path and target resource ID
  - Returns `{ toSelect: string[], toDeselect: string[] }`

### 3. Updated `SelectionContext.tsx`

The `deselect` function now handles two cases:

1. **Direct deselection**: If the resource is directly selected, simply remove it
2. **Ancestor-based deselection**: Use the traversal algorithm to handle complex deselection

## Edge Cases Handled

1. **Resource at root level**: No parent to traverse to
2. **No selected ancestor found**: Fallback to simple deletion
3. **Missing connection ID**: Fallback to simple deletion
4. **Resource already directly selected**: Simple removal from selection set

## Performance Considerations

- The algorithm relies on cached query data from React Query
- Traversal is limited by the depth of the folder hierarchy
- Sibling collection is done at each level during traversal
- All operations are performed on in-memory data structures
