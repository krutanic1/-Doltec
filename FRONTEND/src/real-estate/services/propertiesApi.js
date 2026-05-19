import api from './api/axios';

export async function listProperties(params = {}) {
  const res = await api.get('/properties', { params });
  return res.data;
}

export async function listCities() {
  const res = await api.get('/properties/cities');
  return res.data;
}

export async function listLocalities(city) {
  const res = await api.get('/properties/localities', { params: { city } });
  return res.data;
}

export async function getProperty(slug) {
  const res = await api.get(`/properties/${encodeURIComponent(slug)}`);
  return res.data;
}

export async function createProperty(formData) {
  try {
    const res = await api.post('/properties', formData);
    return res.data;
  } catch (err) {
    console.error('createProperty error:', err);
    if (err.response) {
      console.error('Response status:', err.response.status);
      console.error('Response URL:', err.config.url);
      console.error('Base URL:', err.config.baseURL);
    }
    throw err;
  }
}

export async function updateProperty(id, formData) {
  const res = await api.put(`/properties/${id}`, formData);
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
