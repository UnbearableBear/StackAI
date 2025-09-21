'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useSelection } from '@/contexts/SelectionContext';
import { useKnowledgeBaseIdQueryParameter } from '@/hooks/useKnowledgeBaseIdQueryParameter';
import {
  useCreateKnowledgeBase,
  useUpdateKnowledgeBase,
} from '@/hooks/queries/useKnowledgeBase';
import { Loader2, Plus, RefreshCw } from 'lucide-react';
import { useGoogleDriveConnection } from '@/hooks/queries/useConnections';

export default function ActionBar() {
  const { data: connection } = useGoogleDriveConnection();
  const { selectedResources, getSelectedResourcesList, clearSelection } =
    useSelection();

  const { knowledgeBaseId } = useKnowledgeBaseIdQueryParameter();

  const createKB = useCreateKnowledgeBase(connection.connection_id);
  const updateKB = useUpdateKnowledgeBase();

  const handleCreateKnowledgeBase = async () => {
    const selectedResources = getSelectedResourcesList();
    if (selectedResources.length === 0) return;

    try {
      await createKB.mutateAsync(selectedResources);
    } catch (error) {
      console.error('Failed to create knowledge base:', error);
    }
  };

  const handleUpdateKnowledgeBase = async () => {
    const selectedResources = getSelectedResourcesList();
    if (selectedResources.length === 0 || !knowledgeBaseId) return;

    try {
      await updateKB.mutateAsync({
        knowledgeBaseId,
        resourceIds: selectedResources,
      });
    } catch (error) {
      console.error('Failed to update knowledge base:', error);
    }
  };

  const handleClearSelection = () => {
    clearSelection();
  };

  const hasSelections = selectedResources.size > 0;
  const isButtonDisabled =
    !hasSelections || createKB.isPending || updateKB.isPending;

  return (
    <div className="fixed bottom-6 right-6">
      <Card className="shadow-lg border-2">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              {hasSelections ? (
                <Button size="sm" onClick={handleClearSelection}>
                  Clear all selections
                </Button>
              ) : (
                <span className="text-sm text-muted-foreground flex items-center">
                  No resources selected
                </span>
              )}

              <Button
                size="sm"
                onClick={
                  knowledgeBaseId
                    ? handleUpdateKnowledgeBase
                    : handleCreateKnowledgeBase
                }
                disabled={isButtonDisabled}
              >
                {(knowledgeBaseId ? updateKB.isPending : createKB.isPending) ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : knowledgeBaseId ? (
                  <RefreshCw className="h-4 w-4 mr-2" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                {knowledgeBaseId
                  ? updateKB.isPending
                    ? 'Updating...'
                    : 'Update Knowledge Base'
                  : createKB.isPending
                    ? 'Creating...'
                    : 'Create Knowledge Base'}
              </Button>
            </div>
          </div>

          {(createKB.isError || updateKB.isError) && (
            <div className="mt-2 text-xs text-destructive">
              Failed to {knowledgeBaseId ? 'update' : 'create'} knowledge base.
              Please try again.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
