import api from './api/axios';

export const fetchFeaturedBookings = async (params = {}, config = {}) => {
  const response = await api.get('/bookings', { ...config, params });
  return response.data;
};

export const createFeaturedBooking = async (propertyId, placement = 'homepage') => {
  const response = await api.post('/bookings/book', { propertyId, placement });
  return response.data;
};

export const approveFeatureBooking = async (bookingId, config = {}) => {
  const response = await api.patch(`/bookings/${bookingId}/approve`, undefined, config);
  return response.data;
};

export const rejectFeatureBooking = async (bookingId, reviewNote, config = {}) => {
  const response = await api.patch(`/bookings/${bookingId}/reject`, { reviewNote }, config);
  return response.data;
};
