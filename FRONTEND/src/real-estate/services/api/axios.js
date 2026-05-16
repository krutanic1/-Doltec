import axios from 'axios';
import createAuthStore from '../../stores/authStore';
import Cookies from 'js-cookie';

const authStore = createAuthStore.getState ? createAuthStore : null;

const instance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/v1`,
  timeout: 60000,
});

let isRefreshing = false;
let refreshQueue = [];

function processQueue(error, token = null) {
  refreshQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token)));
  refreshQueue = [];
}

instance.interceptors.request.use((config) => {
  const state = createAuthStore.getState();
  const token = state?.accessToken || localStorage.getItem('token') || Cookies.get('adminToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

instance.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response && err.response.status === 401) {
      if (createAuthStore && createAuthStore.setState) {
        createAuthStore.setState({ accessToken: null, user: null, isAuthenticated: false });
      }
    }
    return Promise.reject(err);
  }
);

export default instance;
