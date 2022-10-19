import axios from 'axios'

const instance = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    }
})

instance.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.post['Authorization'] = 'Bearer ' + token;
    config.headers.get['Authorization'] = 'Bearer ' + token;
  }
  return config;
});

export default instance
