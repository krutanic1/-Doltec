import api from './api/axios';

export async function listProperties(params = {}) {
  const res = await api.get('/properties', { params });
  return res.data;
}

export async function getProperty(slug) {
  const res = await api.get(`/properties/${encodeURIComponent(slug)}`);
  return res.data;
}

export async function createProperty(formData) {
  const res = await api.post('/properties', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

export async function updateProperty(id, formData) {
  const res = await api.put(`/properties/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

export async function deleteProperty(id) {
  const res = await api.delete(`/properties/${id}`);
  return res.data;
}

export async function moderateProperty(id, payload) {
  const res = await api.patch(`/properties/${id}/moderate`, payload);
  return res.data;
}
