export const knowledgeBasesQueryKeys = {
  all: () => ['knowledge_bases'] as const,

  byId: (knowledgeBaseId: string | null) =>
    [...knowledgeBasesQueryKeys.all(), knowledgeBaseId] as const,
};
