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
  baseURL: process.env.VUE_APP_API_URL || '/api',
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
  getAll: () => useMock ? fleetAdapter.getAll() : api.get('/fleets'),
  getById: id => useMock ? fleetAdapter.getById(id) : api.get(`/fleets/${id}`),
  getVehicles: id => useMock ? fleetAdapter.getVehicles(id) : api.get(`/fleets/${id}/vehicles`),
  create: data => useMock ? fleetAdapter.create(data) : api.post('/fleets', data),
  update: (id, data) => useMock ? fleetAdapter.update(id, data) : api.put(`/fleets/${id}`, data),
  delete: id => useMock ? fleetAdapter.delete(id) : api.delete(`/fleets/${id}`),
  assignVehicles: (id, vehicleIds) => useMock ? fleetAdapter.assignVehicles(id, { vehicleIds }) : api.post(`/fleets/${id}/vehicles`, { vehicleIds })
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
