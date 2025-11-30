<template>
  <div>
    <Header title="Monitoreo de Flota en Tiempo Real" />

    <!-- Controles de monitoreo -->
    <div style="display: flex; justify-content: space-between; margin-bottom: 1.25rem;">
      <div style="display: flex; gap: 0.75rem;">
        <div class="form-group" style="margin: 0; width: 250px;">
          <select class="form-control" v-model="filterStatus">
            <option value="">Todos los vehículos</option>
            <option value="active">Vehículos activos</option>
            <option value="warning">Vehículos en ruta</option>
            <option value="inactive">Vehículos detenidos</option>
          </select>
        </div>
        <button class="btn btn-secondary" @click="refreshData">
          <i class="fas fa-redo-alt" style="margin-right: 0.5rem;"></i> Actualizar
        </button>
      </div>
      <div style="display: flex; align-items: center;">
        <span style="margin-right: 0.75rem;">Actualización automática:</span>
        <label class="switch" style="position: relative; display: inline-block; width: 50px; height: 24px;">
          <input type="checkbox" v-model="autoUpdate">
          <span style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: var(--color-turquoise); border-radius: 24px; transition: .4s;"></span>
        </label>
        <span style="margin-left: 0.75rem; color: var(--color-success);">{{ autoUpdate ? 'Activa' : 'Inactiva' }}</span>
      </div>
    </div>

    <!-- Mapa y panel de monitoreo -->
    <div style="display: flex; gap: 1.25rem; height: calc(100vh - 250px);">
      <!-- Mapa de monitoreo (simulado) -->
      <div class="card" style="flex: 2; padding: 0; overflow: hidden; position: relative;">
        <div style="height: 100%; background-color: #f0f0f0; position: relative;">
          <!-- Simulación de un mapa -->
          <div style="height: 100%; background-color: #e9e9e9; position: relative;">
            <!-- Contenido del mapa (simplificado) -->
            <div 
              v-for="vehicle in stats.monitoring.vehicles" 
              :key="vehicle.id"
              style="position: absolute; width: 20px; height: 20px; border-radius: 50%; transform: translate(-50%, -50%);"
              :style="{
                left: `${(vehicle.location.lng + 77.1) * 300}px`,
                top: `${(vehicle.location.lat + 12.15) * -200}px`,
                backgroundColor: getStatusColor(vehicle.status)
              }"
              :title="`${vehicle.model} (${vehicle.plate})`"
            ></div>
          </div>
          
          <!-- Controles del mapa -->
          <div style="position: absolute; top: 10px; right: 10px; background: white; border-radius: 4px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); padding: 5px;">
            <button class="btn btn-secondary" style="padding: 5px; margin: 2px; font-size: 14px;"><i class="fas fa-plus"></i></button>
            <button class="btn btn-secondary" style="padding: 5px; margin: 2px; font-size: 14px;"><i class="fas fa-minus"></i></button>
            <button class="btn btn-secondary" style="padding: 5px; margin: 2px; font-size: 14px;"><i class="fas fa-crosshairs"></i></button>
            <button class="btn btn-secondary" style="padding: 5px; margin: 2px; font-size: 14px;"><i class="fas fa-layer-group"></i></button>
          </div>
          
          <!-- Leyenda del mapa -->
          <div style="position: absolute; bottom: 10px; left: 10px; background: white; border-radius: 4px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); padding: 10px;">
            <div style="display: flex; align-items: center; margin-bottom: 5px;">
              <div style="width: 12px; height: 12px; border-radius: 50%; background-color: var(--color-success); margin-right: 8px;"></div>
              <span>En movimiento</span>
            </div>
            <div style="display: flex; align-items: center; margin-bottom: 5px;">
              <div style="width: 12px; height: 12px; border-radius: 50%; background-color: var(--color-warning); margin-right: 8px;"></div>
              <span>Detenido</span>
            </div>
            <div style="display: flex; align-items: center;">
              <div style="width: 12px; height: 12px; border-radius: 50%; background-color: var(--color-error); margin-right: 8px;"></div>
              <span>Alerta</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Panel de estado de vehículos -->
      <div class="card" style="flex: 1; padding: 0; display: flex; flex-direction: column;">
        <div style="padding: 1.25rem; border-bottom: 1px solid var(--color-gray-medium);">
          <h2 style="margin: 0; font-size: 1.25rem;">Estado de Vehículos</h2>
        </div>
        
        <div style="flex: 1; overflow-y: auto; padding: 0 0.5rem;">
          <div 
            v-for="vehicle in filteredVehicles" 
            :key="vehicle.id"
            style="padding: 1rem; border-bottom: 1px solid var(--color-gray-medium); display: flex; align-items: center;"
          >
            <div 
              style="width: 12px; height: 12px; border-radius: 50%; margin-right: 1rem;"
              :style="{ backgroundColor: getStatusColor(vehicle.status) }"
            ></div>
            <div style="flex: 1;">
              <h3 style="margin: 0; font-size: 1rem;">{{ vehicle.model }} ({{ vehicle.plate }})</h3>
              <p style="margin: 0.25rem 0 0 0; font-size: 0.875rem;">Conductor: {{ vehicle.driver }}</p>
              <p style="margin: 0.25rem 0 0 0; font-size: 0.813rem; color: #666;">Velocidad: {{ vehicle.speed }} km/h{{ vehicle.speed === 0 ? ' (Detenido)' : '' }}</p>
            </div>
            <button class="btn btn-secondary" style="padding: 0.25rem 0.5rem; font-size: 0.813rem;" @click="showVehicleDetails(vehicle)">
              <i class="fas fa-info-circle"></i>
            </button>
          </div>
        </div>
        
        <!-- Resumen de estado -->
        <div style="padding: 1rem; border-top: 1px solid var(--color-gray-medium); background-color: var(--color-gray-light);">
          <div style="display: flex; justify-content: space-between;">
            <span>Total vehículos monitoreados:</span>
            <strong>{{ stats.monitoring.vehicles.length }} / {{ stats.total_vehicles }}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-top: 0.5rem;">
            <span>Última actualización:</span>
            <span>{{ currentDateTime }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Panel de alertas recientes -->
    <div class="card" style="margin-top: 1.25rem;">
      <div class="card-header">
        <h2 class="card-title">Alertas recientes</h2>
        <button class="btn btn-secondary">
          <i class="fas fa-bell-slash" style="margin-right: 0.5rem;"></i> Silenciar alertas
        </button>
      </div>
      
      <div style="display: flex; flex-direction: column; gap: 0.75rem;">
        <div 
          v-for="(alert, index) in stats.monitoring.alerts" 
          :key="index"
          :style="getAlertStyle(alert.type)"
          style="display: flex; gap: 1rem; padding: 0.75rem;"
        >
          <i :class="getAlertIcon(alert.type)" :style="{ color: getAlertColor(alert.type), fontSize: '1.25rem' }"></i>
          <div>
            <h4 style="margin: 0;">{{ alert.title }}</h4>
            <p style="margin: 0.25rem 0 0 0; color: #666;">{{ alert.description }}</p>
            <p style="margin: 0.25rem 0 0 0; font-size: 0.813rem; color: #999;">hace {{ alert.time }}</p>
          </div>
          <button class="btn btn-secondary" style="margin-left: auto; align-self: center; padding: 0.25rem 0.5rem; font-size: 0.813rem;">
            <i class="fas fa-phone"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de detalles del vehículo -->
    <Modal 
      :show="showVehicleModal" 
      title="Detalles del Vehículo"
      @close="showVehicleModal = false"
    >
      <div v-if="selectedVehicle">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
          <div>
            <h3 style="margin: 0;">{{ selectedVehicle.model }} ({{ selectedVehicle.plate }})</h3>
            <p>Conductor: {{ selectedVehicle.driver }}</p>
          </div>
          <StatusBadge 
            :status="selectedVehicle.status" 
            :text="getStatusText(selectedVehicle.status)" 
          />
        </div>
        
        <div style="background-color: var(--color-gray-light); padding: 1rem; border-radius: 4px; margin-bottom: 1rem;">
          <h4 style="margin-top: 0;">Datos en tiempo real</h4>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
            <div>
              <p><strong>Velocidad:</strong> {{ selectedVehicle.speed }} km/h</p>
              <p><strong>Coordenadas:</strong> {{ selectedVehicle.location.lat }}, {{ selectedVehicle.location.lng }}</p>
            </div>
            <div>
              <p><strong>Nivel de combustible:</strong> 75%</p>
              <p><strong>Temperatura del motor:</strong> 78°C</p>
            </div>
          </div>
        </div>
        
        <div style="background-color: var(--color-gray-light); padding: 1rem; border-radius: 4px;">
          <h4 style="margin-top: 0;">Historial reciente</h4>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr>
                <th style="text-align: left; padding: 0.5rem; border-bottom: 1px solid #ddd;">Fecha/Hora</th>
                <th style="text-align: left; padding: 0.5rem; border-bottom: 1px solid #ddd;">Evento</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 0.5rem; border-bottom: 1px solid #eee;">26/04/2025 10:30</td>
                <td style="padding: 0.5rem; border-bottom: 1px solid #eee;">Inicio de ruta</td>
              </tr>
              <tr>
                <td style="padding: 0.5rem; border-bottom: 1px solid #eee;">26/04/2025 09:45</td>
                <td style="padding: 0.5rem; border-bottom: 1px solid #eee;">Carga de combustible</td>
              </tr>
              <tr>
                <td style="padding: 0.5rem; border-bottom: 1px solid #eee;">26/04/2025 09:30</td>
                <td style="padding: 0.5rem; border-bottom: 1px solid #eee;">Verificación pre-ruta</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <template #footer>
        <button class="btn btn-secondary" @click="showVehicleModal = false">Cerrar</button>
        <button class="btn btn-primary">
          <i class="fas fa-phone" style="margin-right: 0.5rem;"></i> Contactar conductor
        </button>
      </template>
    </Modal>
  </div>
</template>

<script>
import { Header, StatusBadge, Modal } from '@/components/common'
import statsData from '@/data/stats.json'

export default {
  name: 'MonitoringPanel',
  components: {
    Header,
    StatusBadge,
    Modal
  },
  data() {
    return {
      stats: statsData,
      filterStatus: '',
      autoUpdate: true,
      updateInterval: null,
      currentDateTime: new Date().toLocaleString(),
      showVehicleModal: false,
      selectedVehicle: null
    }
  },
  computed: {
    filteredVehicles() {
      if (!this.filterStatus) {
        return this.stats.monitoring.vehicles
      }
      
      return this.stats.monitoring.vehicles.filter(v => v.status === this.filterStatus)
    }
  },
  methods: {
    getStatusColor(status) {
      const colorMap = {
        active: 'var(--color-success)',
        warning: 'var(--color-warning)',
        inactive: 'var(--color-warning)',
        error: 'var(--color-error)'
      }
      return colorMap[status] || 'var(--color-success)'
    },
    getStatusText(status) {
      const statusMap = {
        active: 'Activo',
        warning: 'En ruta',
        inactive: 'Detenido',
        error: 'Alerta'
      }
      return statusMap[status] || status
    },
    getAlertStyle(type) {
      const borderColorMap = {
        error: 'var(--color-error)',
        warning: 'var(--color-warning)',
        info: 'var(--color-turquoise)'
      }
      const color = borderColorMap[type] || 'var(--color-turquoise)'
      return {
        borderLeft: `4px solid ${color}`,
        backgroundColor: `rgba(244, 67, 54, 0.05)`
      }
    },
    getAlertColor(type) {
      const colorMap = {
        error: 'var(--color-error)',
        warning: 'var(--color-warning)',
        info: 'var(--color-turquoise)'
      }
      return colorMap[type] || 'var(--color-turquoise)'
    },
    getAlertIcon(type) {
      const iconMap = {
        error: 'fas fa-exclamation-triangle',
        warning: 'fas fa-clock',
        info: 'fas fa-info-circle'
      }
      return iconMap[type] || 'fas fa-info-circle'
    },
    refreshData() {
      // Simular actualización de datos
      this.currentDateTime = new Date().toLocaleString()
      
      // Simular cambios en velocidades
      this.stats.monitoring.vehicles.forEach(vehicle => {
        // Solo cambiar velocidades de vehículos en movimiento
        if (vehicle.status === 'active' && vehicle.speed > 0) {
          // Generar una nueva velocidad aleatoria
          vehicle.speed = Math.max(20, Math.min(100, vehicle.speed + (Math.random() * 20 - 10)))
        }
      })
    },
    showVehicleDetails(vehicle) {
      this.selectedVehicle = vehicle
      this.showVehicleModal = true
    },
    startAutoUpdate() {
      this.stopAutoUpdate()
      if (this.autoUpdate) {
        this.updateInterval = setInterval(() => {
          this.refreshData()
        }, 5000) // Actualizar cada 5 segundos
      }
    },
    // Aquí añadí el método stopAutoUpdate que estaba duplicado
    stopAutoUpdate() {
      if (this.updateInterval) {
        clearInterval(this.updateInterval)
        this.updateInterval = null
      }
    }
  },
  watch: {
    autoUpdate() {
      this.startAutoUpdate()
    }
  },
  created() {
    this.startAutoUpdate()
  },
  beforeDestroy() {
    this.stopAutoUpdate()
  }
}
</script>
