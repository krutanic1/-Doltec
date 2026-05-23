import api from './api/axios';

export const fetchFeaturedBookings = async () => {
  const response = await api.get('/bookings');
  return response.data;
};

export const createFeaturedBooking = async (propertyId, placement = 'homepage') => {
  const response = await api.post('/bookings/book', { propertyId, placement });
  return response.data;
};
