import axios from 'axios';
const API = axios.create({ baseURL: 'https://backendregistroaccidentes-production.up.railway.app/api' });
export default API;
