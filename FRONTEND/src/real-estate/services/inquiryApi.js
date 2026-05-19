import api from './api/axios';

export async function createInquiry(payload) {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/inquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to create inquiry');
  return res.json();
}

export async function listInquiries(params = {}) {
  const resp = await api.get('/inquiries', { params });
  return resp.data;
}

export async function getInquiry(id) {
  const resp = await api.get(`/inquiries/${id}`);
  return resp.data;
}

export async function updateInquiry(id, updates) {
  const resp = await api.patch(`/inquiries/${id}`, updates);
  return resp.data;
}

export async function deleteInquiry(id) {
  const resp = await api.delete(`/inquiries/${id}`);
  return resp.data;
}
