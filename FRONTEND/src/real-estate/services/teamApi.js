import api from './api/axios';

export const fetchTeamMembers = async () => {
  const response = await api.get('/team');
  return response.data;
};

export const inviteTeamMember = async (email, role) => {
  const response = await api.post('/team/invite', { email, role });
  return response.data;
};

export const updateTeamMemberStatus = async (id, status) => {
  const response = await api.put(`/team/${id}/status`, { status });
  return response.data;
};
