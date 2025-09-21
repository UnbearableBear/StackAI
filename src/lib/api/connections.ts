import { apiClient } from '../api-client';

export type Connection = {
  connection_id: string;
  name: string;
  created_at: string;
  updated_at: string;
  connection_provider_data: any;
};

export const listConnections = async (params?: {
  connection_provider?: string;
  limit?: number;
}): Promise<Connection[]> => {
  const response = await apiClient.get('/connections', { params });
  return response.data;
};