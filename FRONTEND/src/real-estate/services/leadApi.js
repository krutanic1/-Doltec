import api from './api/axios';

export async function submitLead(payload) {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to submit lead');
  return res.json();
}

export async function listLeads(params = {}) {
  const resp = await api.get('/leads', { params });
  return resp.data;
}

export async function getLead(id) {
  const resp = await api.get(`/leads/${id}`);
  return resp.data;
}

export async function updateLeadStatus(id, status) {
  const resp = await api.patch(`/leads/${id}/status`, { status });
  return resp.data;
}

export async function assignLead(id, userId) {
  const resp = await api.patch(`/leads/${id}/assign`, { userId });
  return resp.data;
}

export async function addLeadComment(id, message) {
  const resp = await api.post(`/leads/${id}/comment`, { message });
  return resp.data;
}

// ==========================================
// Doltec Real Estate Owner Lead Pipeline & Unlocks
// ==========================================

export async function getOwnerLeads(params = {}) {
  const resp = await api.get('/owner/leads', { params });
  return resp.data;
}

export async function getOwnerLeadById(leadId) {
  const resp = await api.get(`/owner/leads/${leadId}`);
  return resp.data;
}

export async function updateOwnerLeadStatus(leadId, status, notes = '') {
  const resp = await api.patch(`/owner/leads/${leadId}/status`, { status, notes });
  return resp.data;
}

export async function getOwnerPropertyLeads(propertyId) {
  const resp = await api.get(`/owner/properties/${propertyId}/leads`);
  return resp.data;
}

export async function getOwnerLeadsStats() {
  const resp = await api.get('/owner/leads/stats/summary');
  return resp.data;
}

export async function unlockPropertyContact(propertyId) {
  const resp = await api.post(`/properties/${propertyId}/unlock-contact`);
  return resp.data;
}

export async function registerAndUnlockContact(payload) {
  const resp = await api.post('/auth/register-and-unlock', payload);
  return resp.data;
}

export async function loginAndUnlockContact(payload) {
  const resp = await api.post('/auth/login-and-unlock', payload);
  return resp.data;
}
