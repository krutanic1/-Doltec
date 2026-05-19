import api from './api/axios';

export async function fetchWorkspaceOverview() {
  const response = await api.get('/seller-workspace/overview');
  return response.data;
}