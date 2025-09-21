import { apiClient } from '../api-client';

export type KnowledgeBase = {
  knowledge_base_id: string;
  name: string;
  description: string;
  connection_id: string;
  connection_source_ids: string[];
  indexing_params: {
    ocr: boolean;
    unstructured: boolean;
    embedding_params: {
      embedding_model: string;
      api_key: string | null;
    };
    chunker_params: {
      chunk_size: number;
      chunk_overlap: number;
      chunker: string;
    };
  };
  org_level_role: string | null;
  cron_job_id: string | null;
};

export type CreateKnowledgeBaseRequest = {
  name: string;
  description: string;
  connection_id: string;
  connection_source_ids: string[];
  indexing_params: {
    ocr: boolean;
    unstructured: boolean;
    embedding_params: {
      embedding_model: string;
      api_key: string | null;
    };
    chunker_params: {
      chunk_size: number;
      chunk_overlap: number;
      chunker: string;
    };
  };
  org_level_role: string | null;
  cron_job_id: string | null;
};

export type UpdateKnowledgeBaseRequest = {
  name: string;
  description: string;
  connection_id: string;
  connection_source_ids: string[];
  indexing_params: {
    ocr: boolean;
    unstructured: boolean;
    embedding_params: {
      embedding_model: string;
      api_key: string | null;
    };
    chunker_params: {
      chunk_size: number;
      chunk_overlap: number;
      chunker: string;
    };
  };
  org_level_role: string | null;
  cron_job_id: string | null;
};

export type KnowledgeBaseResource = {
  knowledge_base_id: string;
  created_at: string;
  modified_at: string;
  indexed_at: string | null;
  inode_type: 'directory' | 'file';
  resource_id: string;
  inode_path: {
    path: string;
  };
  dataloader_metadata: Record<string, any>;
  user_metadata: Record<string, any>;
  inode_id: string;
  content_hash?: string;
  content_mime?: string;
  size?: number;
  status?: string;
  supabase_signed_url?: string | null;
};

export type CreateKnowledgeBaseResourceRequest = {
  resource_type: 'file';
  resource_path: string;
};

export const getKnowledgeBase = async (
  knowledgeBaseId: string
): Promise<KnowledgeBase> => {
  const response = await apiClient.get(`/knowledge_bases/${knowledgeBaseId}`);
  return response.data;
};

export const createKnowledgeBase = async (
  data: CreateKnowledgeBaseRequest
): Promise<KnowledgeBase> => {
  const response = await apiClient.post('/knowledge_bases', data);
  return response.data;
};

export const updateKnowledgeBase = async (
  knowledgeBaseId: string,
  data: UpdateKnowledgeBaseRequest
): Promise<KnowledgeBase> => {
  const response = await apiClient.put(
    `/knowledge_bases/${knowledgeBaseId}`,
    data
  );
  return response.data;
};

export const syncKnowledgeBase = async (
  knowledgeBaseId: string,
  orgId: string
): Promise<void> => {
  const response = await apiClient.get(
    `/knowledge_bases/sync/trigger/${knowledgeBaseId}/${orgId}`
  );
  return response.data;
};
