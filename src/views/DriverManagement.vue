<template>
  <div>
    <Header title="Gestión de Conductores" />

    <!-- Acciones principales -->
    <div style="display: flex; justify-content: space-between; margin-bottom: 1.875rem;">
      <div>
        <button class="btn btn-primary" @click="showDriverModal = true">
          <i class="fas fa-plus" style="margin-right: 0.5rem;"></i> Nuevo Conductor
        </button>
        <button class="btn btn-secondary" style="margin-left: 0.5rem;">
          <i class="fas fa-filter" style="margin-right: 0.5rem;"></i> Filtros
        </button>
      </div>
      <div class="form-group" style="width: 300px; margin: 0;">
        <div style="position: relative;">
          <input
              type="text"
              class="form-control"
              placeholder="Buscar conductor..."
              style="padding-right: 35px;"
              v-model="searchQuery"
          >
          <i class="fas fa-search" style="position: absolute; right: 10px; top: 12px; color: #666;"></i>
        </div>
      </div>
    </div>

    <!-- Estadísticas de conductores -->
    <div class="dashboard-grid" style="margin-bottom: 1.875rem;">
      <div class="stats-card">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <div class="stats-label">Conductores Activos</div>
            <div class="stats-value">{{ stats.drivers_stats.active }}</div>
            <div style="color: var(--color-success); font-size: 0.875rem;">
              <i class="fas fa-arrow-up"></i> 5% este mes
            </div>
          </div>
          <div class="stats-icon">
            <i class="fas fa-user-check"></i>
          </div>
        </div>
      </div>

      <div class="stats-card">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <div class="stats-label">Licencias por vencer</div>
            <div class="stats-value">{{ stats.drivers_stats.licenses_expiring }}</div>
            <div style="color: var(--color-warning); font-size: 0.875rem;">
              <i class="fas fa-exclamation-triangle"></i> Próximos 30 días
            </div>
          </div>
          <div class="stats-icon">
            <i class="fas fa-id-card"></i>
          </div>
        </div>
      </div>

      <div class="stats-card">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <div class="stats-label">Distancia promedio</div>
            <div class="stats-value">{{ stats.drivers_stats.average_distance }} km</div>
            <div style="color: var(--color-success); font-size: 0.875rem;">
              <i class="fas fa-arrow-up"></i> 12% este mes
            </div>
          </div>
          <div class="stats-icon">
            <i class="fas fa-road"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Listado de conductores -->
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">Listado de conductores</h2>
        <div>
          <button class="btn btn-secondary">
            <i class="fas fa-download" style="margin-right: 0.5rem;"></i> Exportar
          </button>
        </div>
      </div>

      <table class="data-table">
        <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Licencia</th>
          <th>Estado</th>
          <th>Vehículo asignado</th>
          <th>Experiencia</th>
          <th>Acciones</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="driver in paginatedDrivers" :key="driver.id">
          <td>{{ driver.code }}</td>
          <td>{{ driver.name }}</td>
          <td>{{ driver.license.number }} (Vence: {{ formatDate(driver.license.expiry) }})</td>
          <td>
            <StatusBadge :status="driver.status" :text="getStatusText(driver.status)" />
          </td>
          <td>{{ driver.vehicle || 'No asignado' }}</td>
          <td>{{ driver.experience }} años</td>
          <td>
            <button class="btn btn-secondary" style="padding: 0.25rem 0.5rem; font-size: 0.813rem;" @click="viewDriver(driver)">
              <i class="fas fa-eye"></i>
            </button>
            <button class="btn btn-secondary" style="padding: 0.25rem 0.5rem; font-size: 0.813rem;" @click="editDriver(driver)">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-secondary" style="padding: 0.25rem 0.5rem; font-size: 0.813rem;" @click="showStats(driver)">
              <i class="fas fa-chart-line"></i>
            </button>
          </td>
        </tr>
        </tbody>
      </table>

      <!-- Paginación -->
      <Pagination
          :current-page="currentPage"
          :total-items="filteredDrivers.length"
          :per-page="itemsPerPage"
          item-label="conductores"
          @page-change="changePage"
      />
    </div>

    <!-- Modal para nuevo/editar conductor -->
    <Modal
        :show="showDriverModal"
        :title="editingDriver?.id ? 'Editar Conductor' : 'Registrar nuevo conductor'"
        @close="showDriverModal = false"
        @submit="submitDriverFromModal"
    >
      <DriverForm
          ref="driverForm"
          :driver-data="editingDriver"
          @cancel="showDriverModal = false"
      />
    </Modal>

    <!-- Modal para estadísticas del conductor -->
    <Modal
        :show="showStatsModal"
        title="Estadísticas del Conductor"
        @close="showStatsModal = false"
    >
      <div v-if="selectedDriver">
        <h3>{{ selectedDriver.name }}</h3>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1rem 0;">
          <div style="background-color: var(--color-gray-light); padding: 1rem; border-radius: 4px; text-align: center;">
            <h4>Distancia recorrida</h4>
            <div style="font-size: 2.5rem; font-weight: bold; color: var(--color-turquoise);">3,245 km</div>
            <div style="color: var(--color-success); font-size: 0.875rem;">
              <i class="fas fa-arrow-up"></i> 12% este mes
            </div>
          </div>
          <div style="background-color: var(--color-gray-light); padding: 1rem; border-radius: 4px; text-align: center;">
            <h4>Horas de conducción</h4>
            <div style="font-size: 2.5rem; font-weight: bold; color: var(--color-turquoise);">182 h</div>
            <div style="color: var(--color-success); font-size: 0.875rem;">
              <i class="fas fa-arrow-up"></i> 5% este mes
            </div>
          </div>
        </div>

        <div style="background-color: var(--color-gray-light); padding: 1rem; border-radius: 4px; margin-bottom: 1rem;">
          <h4>Rendimiento por mes</h4>
          <div style="height: 200px; background-color: #f0f0f0; border-radius: 4px; display: flex; align-items: flex-end; gap: 15px; padding: 10px; margin-top: 0.5rem;">
            <div v-for="(month, index) in ['Ene', 'Feb', 'Mar', 'Abr', 'May']" :key="index" style="flex: 1; display: flex; flex-direction: column; align-items: center;">
              <div style="width: 30px; background-color: var(--color-turquoise);" :style="{ height: (60 + Math.random() * 100) + 'px' }"></div>
              <span style="margin-top: 5px; font-size: 0.75rem;">{{ month }}</span>
            </div>
          </div>
        </div>

        <div style="background-color: var(--color-gray-light); padding: 1rem; border-radius: 4px;">
          <h4>Incidencias</h4>
          <table style="width: 100%; border-collapse: collapse; margin-top: 0.5rem;">
            <thead>
            <tr>
              <th style="text-align: left; padding: 0.5rem; border-bottom: 1px solid #ddd;">Fecha</th>
              <th style="text-align: left; padding: 0.5rem; border-bottom: 1px solid #ddd;">Tipo</th>
              <th style="text-align: left; padding: 0.5rem; border-bottom: 1px solid #ddd;">Descripción</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td style="padding: 0.5rem; border-bottom: 1px solid #eee;">15/04/2025</td>
              <td style="padding: 0.5rem; border-bottom: 1px solid #eee;">Advertencia</td>
              <td style="padding: 0.5rem; border-bottom: 1px solid #eee;">Exceso de velocidad (78 km/h en zona de 60 km/h)</td>
            </tr>
            <tr>
              <td style="padding: 0.5rem; border-bottom: 1px solid #eee;">02/03/2025</td>
              <td style="padding: 0.5rem; border-bottom: 1px solid #eee;">Retraso</td>
              <td style="padding: 0.5rem; border-bottom: 1px solid #eee;">Llegada tardía (45 minutos) a punto de entrega</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>

      <template #footer>
        <button class="btn btn-secondary" @click="showStatsModal = false">Cerrar</button>
        <button class="btn btn-primary">
          <i class="fas fa-download" style="margin-right: 0.5rem;"></i> Exportar estadísticas
        </button>
      </template>
    </Modal>
  </div>
</template>

<script>
import { Header, StatusBadge, Modal, Pagination } from '@/components/common'
import DriverForm from '@/components/drivers/DriverForm.vue'
import driversData from '@/data/drivers.json'
import statsData from '@/data/stats.json'

export default {
  name: 'DriverManagement',
  components: {
    Header,
    StatusBadge,
    Modal,
    Pagination,
    DriverForm
  },
  data() {
    return {
      drivers: [...driversData],
      stats: statsData,
      searchQuery: '',
      currentPage: 1,
      itemsPerPage: 5,
      showDriverModal: false,
      showStatsModal: false,
      editingDriver: {},
      selectedDriver: null
    }
  },
  computed: {
    filteredDrivers() {
      if (!this.searchQuery) {
        return this.drivers
      }

      const query = this.searchQuery.toLowerCase()
      return this.drivers.filter(driver =>
          driver.name.toLowerCase().includes(query) ||
          driver.code.toLowerCase().includes(query) ||
          driver.license.number.toLowerCase().includes(query)
      )
    },
    paginatedDrivers() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.filteredDrivers.slice(start, end)
    }
  },
  methods: {
    submitDriverFromModal() {
      const formData = this.$refs.driverForm.getFormData()
      this.saveDriver(formData)
    },
    getStatusText(status) {
      const statusMap = {
        active: 'Activo',
        inactive: 'Descanso',
        warning: 'En ruta'
      }
      return statusMap[status] || status
    },
    formatDate(dateString) {
      if (!dateString) return 'N/A'

      const date = new Date(dateString)
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    },
    viewDriver(driver) {
      this.selectedDriver = driver
      this.showDriverModal = true
      this.editingDriver = { ...driver }
    },
    editDriver(driver) {
      this.editingDriver = { ...driver }
      this.showDriverModal = true
    },
    showStats(driver) {
      this.selectedDriver = driver
      this.showStatsModal = true
    },
    saveDriver(driver) {
      if (driver && driver.id) {
        // Update existing driver
        const index = this.drivers.findIndex(d => d.id === driver.id)
        if (index !== -1) {
          this.drivers.splice(index, 1, driver)
        }
      } else {
        // Add new driver
            this.$store.dispatch('drivers/createDriver', driver)
              .then(() => {
                  this.showDriverModal = false
                  this.editingDriver = {}
                })

      }

      this.showDriverModal = false
      this.editingDriver = {}
    },
    changePage(page) {
      this.currentPage = page
    }
  }
}
</script>
