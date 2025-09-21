import { apiClient } from '../api-client';

export type OrganizationCurrentResponse = {
  org_id: string;
};

export const getCurrentOrganization = async (): Promise<OrganizationCurrentResponse> => {
  const response = await apiClient.get('/organizations/me/current');
  return response.data;
};