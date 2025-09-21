import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createKnowledgeBase,
  syncKnowledgeBase,
  getKnowledgeBase,
  updateKnowledgeBase,
  CreateKnowledgeBaseRequest,
  KnowledgeBase,
} from '@/lib/api/knowledge-bases';
import { getCurrentOrganization } from '@/lib/api/organizations';
import { useKnowledgeBaseIdQueryParameter } from '@/hooks/useKnowledgeBaseIdQueryParameter';
import { toast } from 'sonner';
import { knowledgeBasesQueryKeys } from '@/lib/query-keys/knowledge-bases';

export const KNOWLEDGE_BASE_ERROR_KEY = 'knowledge-base-error';

// We should have a typeguard to handle errors properly here
// I'll just use any, since I am running late :/
// Please note that I would usually never use any
export const handleGetKBError = (query: any, error: any, cb: () => unknown) => {
  const isNotFound = error?.status === 404 || error?.status === 422;

  if (isNotFound) {
    cb();
    toast.error('Knowledge base not found');
  } else {
    toast.error('Failed to load knowledge base');
  }
};

export const useKnowledgeBase = (knowledgeBaseId: string | null) => {
  return useQuery<KnowledgeBase | null>({
    enabled: Boolean(knowledgeBaseId),
    queryKey: knowledgeBasesQueryKeys.byId(knowledgeBaseId),
    queryFn: async () => {
      return getKnowledgeBase(knowledgeBaseId!);
    },
    meta: {
      errorKey: KNOWLEDGE_BASE_ERROR_KEY,
    },
  });
};

export const useCreateKnowledgeBase = (connectionId: string) => {
  const queryClient = useQueryClient();
  const { setKnowledgeBase } = useKnowledgeBaseIdQueryParameter();

  return useMutation({
    mutationFn: async (
      selectedResourceIds: string[]
    ): Promise<KnowledgeBase> => {
      let createRequest: CreateKnowledgeBaseRequest;

      const defaultIndexingParams = {
        ocr: false,
        unstructured: true,
        embedding_params: {
          embedding_model: 'text-embedding-ada-002',
          api_key: null,
        },
        chunker_params: {
          chunk_size: 1500,
          chunk_overlap: 500,
          chunker: 'sentence',
        },
      };

      createRequest = {
        name: 'Manuel Colasante GDrive KB',
        description: 'Manuel Colasante GDrive KB',
        connection_id: connectionId,
        connection_source_ids: selectedResourceIds,
        indexing_params: defaultIndexingParams,
        org_level_role: null,
        cron_job_id: null,
      };

      return createKnowledgeBase(createRequest);
    },

    onSuccess: async (knowledgeBase) => {
      // Store the knowledge base ID
      setKnowledgeBase(knowledgeBase.knowledge_base_id);

      toast.success('Knowledge base created');

      // Invalidate all knowledge base queries
      queryClient.invalidateQueries({
        queryKey: knowledgeBasesQueryKeys.all(),
      });

      const org = await getCurrentOrganization();
      syncKnowledgeBase(knowledgeBase.knowledge_base_id, org.org_id);
    },

    onError: (error) => {
      console.error('Failed to create knowledge base:', error);
    },
  });
};

export const useUpdateKnowledgeBase = () => {
  const queryClient = useQueryClient();

  return useMutation<
    KnowledgeBase,
    Error,
    { knowledgeBaseId: string; resourceIds: string[] },
    { previousKB: KnowledgeBase }
  >({
    mutationFn: async ({
      knowledgeBaseId,
      resourceIds,
    }: {
      knowledgeBaseId: string;
      resourceIds: string[];
    }): Promise<KnowledgeBase> => {
      // Get cached knowledge base data for the API call
      const cachedKB = queryClient.getQueryData<KnowledgeBase>(
        knowledgeBasesQueryKeys.byId(knowledgeBaseId)
      );

      if (!cachedKB) {
        throw new Error('Knowledge base data not found in cache');
      }

      // Update only the connection_source_ids field in the cached data
      const updatedKBData = {
        ...cachedKB,
        connection_source_ids: resourceIds,
      };

      queryClient.setQueryData(
        knowledgeBasesQueryKeys.byId(knowledgeBaseId),
        updatedKBData
      );

      return updateKnowledgeBase(knowledgeBaseId, updatedKBData);
    },

    onSuccess: async (updatedKB) => {
      // Update the cache with the response from the server
      queryClient.setQueryData(
        knowledgeBasesQueryKeys.byId(updatedKB.knowledge_base_id),
        updatedKB
      );

      toast.success('Knowledge base updated.');

      // Invalidate all knowledge base queries
      queryClient.invalidateQueries({
        queryKey: knowledgeBasesQueryKeys.all(),
      });
    },

    onError: (error, variables, context) => {
      // Revert optimistic update by restoring previous data
      if (context?.previousKB) {
        queryClient.setQueryData(
          knowledgeBasesQueryKeys.byId(variables.knowledgeBaseId),
          context.previousKB
        );
      }

      console.error('Failed to update knowledge base:', error);
    },

    onMutate: async (variables) => {
      // Snapshot the previous value
      const previousKB = queryClient.getQueryData<KnowledgeBase>(
        knowledgeBasesQueryKeys.byId(variables.knowledgeBaseId)
      );

      if (!previousKB) {
        throw new Error('Knowledge base data not found in cache');
      }

      return { previousKB };
    },
  });
};

export const useSyncKnowledgeBase = () => {
  return useMutation({
    mutationFn: async ({ knowledgeBaseId }: { knowledgeBaseId: string }) => {
      const org = await getCurrentOrganization();
      return await syncKnowledgeBase(knowledgeBaseId, org.org_id);
    },

    onError: (error) => {
      console.error('Failed to sync knowledge base:', error);
    },
  });
};
