import api from './api/axios';

export async function fetchListings(params = {}) {
  const response = await api.get('/listings', { params });
  return response.data;
}

export async function fetchListingById(id) {
  const response = await api.get(`/listings/${id}`);
  return response.data;
}

export async function createNewListing(data) {
  const response = await api.post('/listings', data);
  return response.data;
}

export async function updateListing(id, data) {
  const response = await api.patch(`/listings/${id}`, data);
  return response.data;
}

export async function changeListingStatus(id, status) {
  const response = await api.patch(`/listings/${id}/status`, { status });
  return response.data;
}

export async function upgradeListingTier(id, tier) {
  const response = await api.patch(`/listings/${id}/tier`, { tier });
  return response.data;
}

export async function softDeleteListing(id) {
  const response = await api.delete(`/listings/${id}`);
  return response.data;
}

export async function bulkActionListings(ids, action) {
  const response = await api.post('/listings/bulk-action', { ids, action });
  return response.data;
}

export async function fetchListingStats() {
  const response = await api.get('/listings/stats/summary');
  return response.data;
}
