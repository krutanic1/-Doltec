import axios from 'axios';
import createAuthStore from '../../stores/authStore';

const authStore = createAuthStore.getState ? createAuthStore : null;

const instance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/v1`,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

let isRefreshing = false;
let refreshQueue = [];

function processQueue(error, token = null) {
  refreshQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token)));
  refreshQueue = [];
}

instance.interceptors.request.use((config) => {
  const state = createAuthStore.getState();
  const token = state?.accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

instance.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;
    if (err.response && err.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          refreshQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = 'Bearer ' + token;
            return instance(originalRequest);
          })
          .catch((e) => Promise.reject(e));
      }

      originalRequest._retry = true;
      isRefreshing = true;
      try {
        const res = await instance.post('/auth/refresh');
        const { accessToken, user } = res.data;
        if (createAuthStore && createAuthStore.setState) {
          createAuthStore.setState({ accessToken, user, isAuthenticated: true });
        }
        processQueue(null, accessToken);
        return instance(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        if (createAuthStore && createAuthStore.setState) {
          createAuthStore.setState({ accessToken: null, user: null, isAuthenticated: false });
        }
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(err);
  }
);

export default instance;
