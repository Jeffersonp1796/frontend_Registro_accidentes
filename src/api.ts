import axios from 'axios';
const API = axios.create({ baseURL: 'https://backendregistroaccidentes-production.up.railway.app/api' });
//const API = axios.create({ baseURL: 'http://localhost:3001/api' });
export default API;
