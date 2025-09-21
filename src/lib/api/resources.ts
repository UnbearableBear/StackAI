import { apiClient } from '../api-client';
import { PaginatedResponse } from './types';

export type Resource = {
  resource_id: string;
  inode_type: 'directory' | 'file';
  inode_path: {
    path: string;
  };
  status?: string;
};

export const getConnectionResources = async (
  connectionId: string,
  params?: { resource_id?: string }
): Promise<PaginatedResponse<Resource>> => {
  const response = await apiClient.get(`/connections/${connectionId}/resources`, { params });
  return response.data;
};

export const getConnectionResourcesChildren = async (
  connectionId: string,
  params?: { resource_id?: string }
): Promise<PaginatedResponse<Resource>> => {
  const response = await apiClient.get(`/connections/${connectionId}/resources/children`, { params });
  return response.data;
};

