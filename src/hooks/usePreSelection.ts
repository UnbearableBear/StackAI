'use client';

import { useEffect, useState } from 'react';
import { useSelection } from '@/contexts/SelectionContext';
import { useKnowledgeBaseIdQueryParameter } from '@/hooks/useKnowledgeBaseIdQueryParameter';
import { useKnowledgeBase } from '@/hooks/queries/useKnowledgeBase';

export const usePreSelection = () => {
  const { setSelectedResources } = useSelection();
  const { knowledgeBaseId } = useKnowledgeBaseIdQueryParameter();

  // Fetch knowledge base data if ID exists
  const { data: knowledgeBase } = useKnowledgeBase(knowledgeBaseId);

  // Sync selections with existing knowledge base resources
  // This might be too aggressive. We might want to sync just
  // once initially ?
  useEffect(() => {
    if (knowledgeBase && knowledgeBase.connection_source_ids) {
      setSelectedResources(knowledgeBase.connection_source_ids);
    }
  }, [setSelectedResources, knowledgeBase]);
};
