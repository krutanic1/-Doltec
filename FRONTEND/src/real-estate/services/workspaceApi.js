import api from './api/axios';

export async function fetchWorkspaceProperties(params = {}) {
  const response = await api.get('/seller-workspace/properties', { params });
  return response.data;
}