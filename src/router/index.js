import Vue from 'vue'
import VueRouter from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Login from '../views/Login.vue'
import FleetManagement from '../views/FleetManagement.vue'
import VehicleManagement from '../views/VehicleManagement.vue'
import DriverManagement from '../views/DriverManagement.vue'
import Reporting from '../views/Reporting.vue'
import Monitoring from '../views/Monitoring.vue'
import Analytics from '../views/Analytics.vue'
import Register from '../views/Register.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { layout: 'auth' }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { layout: 'auth' }
  },
  {
    path: '/fleet-management',
    name: 'FleetManagement',
    component: FleetManagement
  },
  {
    path: '/vehicle-management',
    name: 'VehicleManagement',
    component: VehicleManagement
  },
  {
    path: '/driver-management',
    name: 'DriverManagement',
    component: DriverManagement
  },
  {
    path: '/reporting',
    name: 'Reporting',
    component: Reporting
  },
  {
    path: '/monitoring',
    name: 'Monitoring',
    component: Monitoring
  },
  {
    path: '/analytics',
    name: 'Analytics',
    component: Analytics
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// Navegación guard para redirigir a login si no está autenticado
router.beforeEach((to, from, next) => {
  // Aquí iría la lógica de validación de autenticación
  // Por simplicidad, siempre permitimos el acceso
  next()
})

export default router