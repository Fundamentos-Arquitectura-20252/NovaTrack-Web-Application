import axios from 'axios'
import {
  vehicleAdapter,
  driverAdapter,
  fleetAdapter,
  reportAdapter,
  monitoringAdapter,
  analyticsAdapter,
  authAdapter
} from './mockAdapter'

// Determinar si usamos los adaptadores mock (durante desarrollo)
const useMock = false

// Crear instancia de Axios con configuración base
const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL || '/fleetmanagement/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptores para manejar autenticación y errores
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)


// Definir servicios para cada entidad, usando adaptadores mock si está en modo desarrollo
const vehicleService = {
  getAll: () => useMock ? vehicleAdapter.getAll() : api.get('/vehicles'),
  getById: id => useMock ? vehicleAdapter.getById(id) : api.get(`/vehicles/${id}`),
  create: data => useMock ? vehicleAdapter.create(data) : api.post('/vehicles', data),
  update: (id, data) => useMock ? vehicleAdapter.update(id, data) : api.put(`/vehicles/${id}`, data),
  delete: id => useMock ? vehicleAdapter.delete(id) : api.delete(`/vehicles/${id}`)
}

const driverService = {
  getAll: () => useMock ? driverAdapter.getAll() : api.get('/personnel/drivers'),
  getById: id => useMock ? driverAdapter.getById(id) : api.get(`/personnel/drivers/${id}`),
  create: data => useMock ? driverAdapter.create(data) : api.post('/personnel/drivers', data),
  update: (id, data) => useMock ? driverAdapter.update(id, data) : api.put(`/personnel/drivers/${id}`, data),
  delete: id => useMock ? driverAdapter.delete(id) : api.delete(`/personnel/drivers/${id}`)
}

const fleetService = {
  getAll: async () => {
    const url = '/fleetmanagement/api/fleets/';
    console.log(`[FleetService] GET Request: ${url}`);
    if (useMock) return fleetAdapter.getAll();
    try {
      const response = await api.get(url);
      console.log(`[FleetService] GET Response: ${url}`, response.data);
      return response;
    } catch (error) {
      console.error(`[FleetService] GET Error: ${url}`, error);
      throw error;
    }
  },
  getById: async (id) => {
    const url = `/fleetmanagement/api/fleets/${id}`;
    console.log(`[FleetService] GET Request: ${url}`);
    if (useMock) return fleetAdapter.getById(id);
    try {
      const response = await api.get(url);
      console.log(`[FleetService] GET Response: ${url}`, response.data);
      return response;
    } catch (error) {
      console.error(`[FleetService] GET Error: ${url}`, error);
      throw error;
    }
  },
  getVehicles: async (id) => {
    const url = '/fleetmanagement/api/vehicles';
    console.log(`[FleetService] GET Request: ${url}?fleetId=${id}`);
    if (useMock) return fleetAdapter.getVehicles(id);
    try {
      const response = await api.get(url, { params: { fleetId: id } });
      console.log(`[FleetService] GET Response: ${url}`, response.data);
      return response;
    } catch (error) {
      console.error(`[FleetService] GET Error: ${url}`, error);
      throw error;
    }
  },
  create: async (data) => {
    const url = '/fleetmanagement/api/fleets/';
    console.log(`[FleetService] POST Request: ${url}`, data);
    if (useMock) return fleetAdapter.create(data);
    try {
      const response = await api.post(url, data);
      console.log(`[FleetService] POST Response: ${url}`, response.data);
      return response;
    } catch (error) {
      console.error(`[FleetService] POST Error: ${url}`, error);
      throw error;
    }
  },
  update: async (id, data) => {
    const url = `/fleetmanagement/api/fleets/${id}`;
    console.log(`[FleetService] PUT Request: ${url}`, data);
    if (useMock) return fleetAdapter.update(id, data);
    try {
      const response = await api.put(url, data);
      console.log(`[FleetService] PUT Response: ${url}`, response.data);
      return response;
    } catch (error) {
      console.error(`[FleetService] PUT Error: ${url}`, error);
      throw error;
    }
  },
  delete: async (id) => {
    const url = `/fleetmanagement/api/fleets/${id}`;
    console.log(`[FleetService] DELETE Request: ${url}`);
    if (useMock) return fleetAdapter.delete(id);
    try {
      const response = await api.delete(url);
      console.log(`[FleetService] DELETE Response: ${url}`, response.data);
      return response;
    } catch (error) {
      console.error(`[FleetService] DELETE Error: ${url}`, error);
      throw error;
    }
  },
  assignVehicles: async (id, vehicleIds) => {
    const url = `/fleetmanagement/api/fleets/${id}/vehicles`;
    const payload = { vehicleIds };
    console.log(`[FleetService] POST Request: ${url}`, payload);
    if (useMock) return fleetAdapter.assignVehicles(id, payload);
    try {
      const response = await api.post(url, payload);
      console.log(`[FleetService] POST Response: ${url}`, response.data);
      return response;
    } catch (error) {
      console.error(`[FleetService] POST Error: ${url}`, error);
      throw error;
    }
  }
}

const reportService = {
  generate: params => useMock ? reportAdapter.generate(params) : api.post('/reports/generate', params),
  getAll: () => useMock ? reportAdapter.getAll() : api.get('/reports'),
  getById: id => useMock ? reportAdapter.getById(id) : api.get(`/reports/${id}`),
  delete: id => useMock ? reportAdapter.delete(id) : api.delete(`/reports/${id}`)
}

const monitoringService = {
  getActiveVehicles: () => useMock ? monitoringAdapter.getActiveVehicles() : api.get('/monitoring/vehicles'),
  getVehicleLocation: id => useMock ? monitoringAdapter.getVehicleLocation(id) : api.get(`/monitoring/vehicles/${id}/location`),
  getAlerts: () => useMock ? monitoringAdapter.getAlerts() : api.get('/monitoring/alerts')
}

const analyticsService = {
  runAnalysis: params => useMock ? analyticsAdapter.runAnalysis(params) : api.post('/analytics/run', params),
  getPredictions: () => useMock ? analyticsAdapter.getPredictions() : api.get('/analytics/predictions'),
  getRecentAnalyses: () => useMock ? analyticsAdapter.getRecentAnalyses() : api.get('/analytics/recent')
}

const authService = {
  login: credentials => useMock ? authAdapter.login(credentials) : api.post('/auth/login', credentials),
  logout: () => useMock ? authAdapter.logout() : api.post('/auth/logout'),
  getProfile: () => useMock ? authAdapter.getProfile() : api.get('/auth/profile')
}

export {
  vehicleService,
  driverService,
  fleetService,
  reportService,
  monitoringService,
  analyticsService,
  authService
}
