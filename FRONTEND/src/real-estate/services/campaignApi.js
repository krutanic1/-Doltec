import api from './api/axios';

export const fetchCampaignAnalytics = async () => {
  const response = await api.get('/campaigns/analytics');
  return response.data;
};
