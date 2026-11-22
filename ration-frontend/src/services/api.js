import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Reusable API methods for Cleaner Code
// Reusable API methods for Cleaner Code
export const getShops = () => api.get('/shops');
export const addShop = (data) => api.post('/add-shop', data);
export const registerUser = (data) => api.post('/register', data);
export const loginUser = (data) => api.post('/login', data);
export const bookSlot = (data) => api.post('/book-slot', data);

export const getNotifications = () => api.get('/notifications');
export const getShopsLoc = (lat, lng) => api.get(`/shops?lat=${lat}&lng=${lng}`);
export const getShopSlots = (shopId, date) => api.get(`/shop-slots/${shopId}/${date}`);
export const updateShopStatus = (id, data) => api.put(`/update-status/${id}`, data);
export const updateShopStock = (id, data) => api.put(`/update-stock/${id}`, data);
export const addNotification = (shopId, data) => api.put(`/update-announcement/${shopId}`, data);
export const getAdminBookings = (shopId) => api.get(`/admin/bookings/${shopId}`);
export const verifyBooking = (id) => api.put(`/verify-booking/${id}`);
export const getMyShop = () => api.get('/admin/my-shop');

export default api;
