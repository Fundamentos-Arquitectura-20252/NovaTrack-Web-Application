<template>
  <div>
    <Header title="Gestión de Flota" />

    <!-- Resumen de flotas -->
    <div class="dashboard-grid" style="margin-bottom: 1.875rem;">
      <!-- Resumen general -->
      <div class="stats-card">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <div class="stats-label">Total de Flotas</div>
            <div class="stats-value">{{ fleets.length }}</div>
            <div style="font-size: 0.875rem; color: #666;">
              {{ totalVehicles }} vehículos en total
            </div>
          </div>
          <div class="stats-icon">
            <i class="fas fa-truck-moving"></i>
          </div>
        </div>
      </div>

      <!-- Tarjetas para cada flota -->
      <div class="stats-card" v-for="fleet in fleets" :key="fleet.id">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <div class="stats-label">{{ fleet.name }}</div>
            <div class="stats-value">{{ fleet.vehicleCount }}</div>
            <div :style="{ fontSize: '0.875rem', color: fleet.performance >= 90 ? 'var(--color-success)' : 'var(--color-warning)' }">
              <i :class="['fas', fleet.performance >= 90 ? 'fa-check-circle' : 'fa-exclamation-circle']"></i> {{ fleet.performance }}% operativo
            </div>
          </div>
          <div class="stats-icon">
            <i :class="getFleetIcon(fleet.name)"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Gestión de flotas -->
    <div class="card" style="margin-bottom: 1.875rem;">
      <div class="card-header">
        <h2 class="card-title">Gestión de Flotas</h2>
        <button class="btn btn-primary" @click="showNewFleetModal = true">
          <i class="fas fa-plus" style="margin-right: 0.5rem;"></i> Nueva Flota
        </button>
      </div>

      <table class="data-table">
        <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Descripción</th>
          <th>Vehículos</th>
          <th>Estado</th>
          <th>Performance</th>
          <th>Acciones</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="fleet in fleets" :key="fleet.id">
          <td>{{ fleet.code }}</td>
          <td>{{ fleet.name }}</td>
          <td>{{ fleet.description }}</td>
          <td>{{ fleet.vehicleCount }}</td>
          <td>
            <StatusBadge :status="fleet.isActive ? 'active' : 'inactive'" :text="getStatusText(fleet.isActive)" />
          </td>
          <td>
            <div style="width: 100%; height: 8px; background-color: #f0f0f0; border-radius: 4px;">
              <div
                  style="height: 100%; background-color: var(--color-success); border-radius: 4px;"
                  :style="{ width: `${fleet.performance}%`, backgroundColor: getPerformanceColor(fleet.performance) }"
              ></div>
            </div>
            <span style="font-size: 0.75rem; color: #666;">{{ fleet.performance }}%</span>
          </td>
          <td>
            <button class="btn btn-secondary" style="padding: 0.25rem 0.5rem; font-size: 0.813rem;" @click="viewFleet(fleet)">
              <i class="fas fa-eye"></i>
            </button>
            <button class="btn btn-secondary" style="padding: 0.25rem 0.5rem; font-size: 0.813rem;" @click="editFleet(fleet)">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-secondary" style="padding: 0.25rem 0.5rem; font-size: 0.813rem;" @click="showFleetStats(fleet)">
              <i class="fas fa-chart-line"></i>
            </button>
            <button class="btn btn-secondary" style="padding: 0.25rem 0.5rem; font-size: 0.813rem; color: var(--color-error);" @click="deleteFleet(fleet)">
              <i class="fas fa-trash"></i>
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- Detalle de flota seleccionada -->
    <div class="card" v-if="selectedFleet">
      <div class="card-header">
        <h2 class="card-title">{{ selectedFleet.name }} ({{ selectedFleet.code }})</h2>
        <div>
          <button class="btn btn-secondary">
            <i class="fas fa-chart-bar" style="margin-right: 0.5rem;"></i> Reportes
          </button>
          <button class="btn btn-primary" style="margin-left: 0.5rem;" @click="openAssignModal">
            <i class="fas fa-user-plus" style="margin-right: 0.5rem;"></i> Asignar vehículos
          </button>
        </div>
      </div>

      <!-- Pestañas para la información de flota -->
      <div style="margin-top: 1.25rem; border-bottom: 1px solid var(--color-gray-medium);">
        <div style="display: flex; gap: 0.5rem; overflow-x: auto;">
          <button
              v-for="(tab, index) in fleetTabs"
              :key="index"
              class="btn"
              :style="{
              padding: '0.75rem 1.25rem',
              borderRadius: '4px 4px 0 0',
              backgroundColor: activeFleetTab === index ? 'var(--color-turquoise)' : 'transparent',
              color: activeFleetTab === index ? 'var(--color-text)' : '',
              marginBottom: '-1px',
              borderBottom: activeFleetTab === index ? '2px solid var(--color-turquoise)' : ''
            }"
              @click="activeFleetTab = index"
          >
            {{ tab }}
          </button>
        </div>
      </div>

      <!-- Contenido de la pestaña seleccionada -->
      <div style="padding: 1.25rem 0;">
        <!-- Herramientas de búsqueda y filtrado -->
        <div style="display: flex; justify-content: space-between; margin-bottom: 1.25rem;">
          <div class="form-group" style="width: 300px; margin: 0;">
            <div style="position: relative;">
              <input
                  type="text"
                  class="form-control"
                  placeholder="Buscar vehículo..."
                  style="padding-right: 35px;"
                  v-model="fleetVehicleSearch"
              >
              <i class="fas fa-search" style="position: absolute; right: 10px; top: 12px; color: #666;"></i>
            </div>
          </div>
          <div>
            <button class="btn btn-secondary">
              <i class="fas fa-filter" style="margin-right: 0.5rem;"></i> Filtros
            </button>
            <button class="btn btn-secondary" style="margin-left: 0.5rem;">
              <i class="fas fa-download" style="margin-right: 0.5rem;"></i> Exportar
            </button>
          </div>
        </div>

        <!-- Tabla de vehículos de la flota -->
        <table class="data-table">
          <thead>
          <tr>
            <th>Placa</th>
            <th>Modelo</th>
            <th>Conductor asignado</th>
            <th>Estado</th>
            <th>Último servicio</th>
            <th>Próximo servicio</th>
            <th>Acciones</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="vehicle in paginatedFleetVehicles" :key="vehicle.id">
            <td>{{ vehicle.licensePlate || vehicle.plate }}</td>
            <td>{{ vehicle.model }} {{ vehicle.year }}</td>
            <td>{{ vehicle.assignedDriver || 'No asignado' }}</td>
            <td>
              <StatusBadge :status="vehicle.status" :text="getStatusText(vehicle.status)" />
            </td>
            <td>{{ formatDate(vehicle.lastService) }}</td>
            <td>{{ formatDate(vehicle.nextService) }}</td>
            <td>
              <button class="btn btn-secondary" style="padding: 0.25rem 0.5rem; font-size: 0.813rem;">
                <i class="fas fa-eye"></i>
              </button>
              <button class="btn btn-secondary" style="padding: 0.25rem 0.5rem; font-size: 0.813rem; margin: 0 0.25rem;">
                <i class="fas fa-exchange-alt"></i>
              </button>
              <button class="btn btn-secondary" style="padding: 0.25rem 0.5rem; font-size: 0.813rem;">
                <i class="fas fa-times"></i>
              </button>
            </td>
          </tr>
          </tbody>
        </table>

        <!-- Paginación -->
        <Pagination
            :current-page="fleetVehiclePage"
            :total-items="filteredFleetVehicles.length"
            :per-page="itemsPerPage"
            item-label="vehículos"
            @page-change="fleetVehiclePage = $event"
        />
      </div>
    </div>

    <!-- Modal para asignar vehículos -->
    <Modal
        :show="showAssignVehiclesModal"
        title="Asignar vehículos a Flota"
        @close="showAssignVehiclesModal = false"
    >
      <div v-if="selectedFleet">
        <!-- Pestañas para tipos de asignación -->
        <div style="margin-bottom: 1.25rem; border-bottom: 1px solid var(--color-gray-medium);">
          <div style="display: flex; gap: 0.5rem;">
            <button
                class="btn"
                style="padding: 0.75rem 1.25rem; border-radius: 4px 4px 0 0; background-color: var(--color-turquoise); color: var(--color-text); margin-bottom: -1px; border-bottom: 2px solid var(--color-turquoise);"
            >
              Vehículos disponibles
            </button>
            <button
                class="btn btn-secondary"
                style="padding: 0.75rem 1.25rem; border-radius: 4px 4px 0 0; background-color: transparent; margin-bottom: -1px;"
            >
              Crear nuevo vehículo
            </button>
          </div>
        </div>

        <!-- Buscador de vehículos disponibles -->
        <div style="display: flex; justify-content: space-between; margin-bottom: 1.25rem;">
          <div class="form-group" style="flex: 1; margin: 0;">
            <div style="position: relative;">
              <input
                  type="text"
                  class="form-control"
                  placeholder="Buscar vehículo por placa o modelo..."
                  style="padding-right: 35px;"
                  v-model="assignVehicleSearch"
              >
              <i class="fas fa-search" style="position: absolute; right: 10px; top: 12px; color: #666;"></i>
            </div>
          </div>
          <button class="btn btn-secondary" style="margin-left: 0.75rem;">
            <i class="fas fa-filter" style="margin-right: 0.5rem;"></i> Filtros
          </button>
        </div>

        <!-- Listado de vehículos disponibles -->
        <div style="height: 300px; overflow-y: auto; border: 1px solid var(--color-gray-medium); border-radius: 4px; margin-bottom: 1.25rem;">
          <table style="width: 100%; border-collapse: collapse;">
            <thead style="position: sticky; top: 0; background-color: var(--color-gray-light);">
            <tr>
              <th style="padding: 0.75rem; text-align: left; border-bottom: 1px solid var(--color-gray-medium);">
                <input type="checkbox" id="selectAll" v-model="selectAllVehicles" @change="toggleAllVehicles">
              </th>
              <th style="padding: 0.75rem; text-align: left; border-bottom: 1px solid var(--color-gray-medium);">Placa</th>
              <th style="padding: 0.75rem; text-align: left; border-bottom: 1px solid var(--color-gray-medium);">Modelo</th>
              <th style="padding: 0.75rem; text-align: left; border-bottom: 1px solid var(--color-gray-medium);">Año</th>
              <th style="padding: 0.75rem; text-align: left; border-bottom: 1px solid var(--color-gray-medium);">Estado</th>
              <th style="padding: 0.75rem; text-align: left; border-bottom: 1px solid var(--color-gray-medium);">Flota actual</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="vehicle in availableVehicles" :key="vehicle.id">
              <td style="padding: 0.75rem; text-align: left; border-bottom: 1px solid #eee;">
                <input
                    type="checkbox"
                    :value="vehicle.id"
                    v-model="selectedVehiclesToAssign"
                >
              </td>
              <td style="padding: 0.75rem; text-align: left; border-bottom: 1px solid #eee;">{{ vehicle.licensePlate || vehicle.plate }}</td>
              <td style="padding: 0.75rem; text-align: left; border-bottom: 1px solid #eee;">{{ vehicle.model }}</td>
              <td style="padding: 0.75rem; text-align: left; border-bottom: 1px solid #eee;">{{ vehicle.year }}</td>
              <td style="padding: 0.75rem; text-align: left; border-bottom: 1px solid #eee;">
                <StatusBadge :status="vehicle.status" :text="getStatusText(vehicle.status)" />
              </td>
              <td style="padding: 0.75rem; text-align: left; border-bottom: 1px solid #eee;">{{ vehicle.fleet || 'No asignado' }}</td>
            </tr>
            </tbody>
          </table>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <span>{{ availableVehicles.length }} vehículos disponibles, {{ selectedVehiclesToAssign.length }} seleccionados</span>
          </div>
          <div style="display: flex; gap: 0.75rem;">
            <button class="btn btn-secondary" @click="showAssignVehiclesModal = false">Cancelar</button>
            <button
                class="btn btn-primary"
                :disabled="selectedVehiclesToAssign.length === 0"
                @click="assignVehicles"
            >
              Asignar vehículos seleccionados
            </button>
          </div>
        </div>
      </div>
    </Modal>

    <!-- Modal para nueva flota -->
    <Modal
        :show="showNewFleetModal"
        :title="editingFleet.id ? 'Editar Flota' : 'Nueva Flota'"
        @close="showNewFleetModal = false"
    >
      <form @submit.prevent="saveFleet">
        <div class="form-group">
          <label for="fleetCode" class="form-label">Código *</label>
          <input type="text" id="fleetCode" class="form-control" v-model="editingFleet.code" required placeholder="Ej. FL-001">
        </div>

        <div class="form-group">
          <label for="fleetName" class="form-label">Nombre *</label>
          <input type="text" id="fleetName" class="form-control" v-model="editingFleet.name" required>
        </div>

        <div class="form-group">
          <label for="fleetDescription" class="form-label">Descripción</label>
          <textarea id="fleetDescription" class="form-control" rows="3" v-model="editingFleet.description"></textarea>
        </div>

        <div class="form-group">
          <label for="fleetType" class="form-label">Tipo</label>
          <select id="fleetType" class="form-control" v-model="editingFleet.type">
            <option value="" disabled>Seleccione un tipo</option>
            <option value="Primary">Primary</option>
            <option value="Secondary">Secondary</option>
            <option value="External">External</option>
            <option value="Rental">Rental</option>
          </select>
        </div>

        <div class="form-group">
          <label for="fleetStatus" class="form-label">Estado</label>
          <select id="fleetStatus" class="form-control" v-model="editingFleet.isActive">
            <option :value="true">Activa</option>
            <option :value="false">Inactiva</option>
          </select>
        </div>
      </form>
      <template #footer>
        <button type="button" class="btn btn-secondary" @click="showNewFleetModal = false">Cancelar</button>
        <button type="button" class="btn btn-primary" @click="saveFleet">{{ editingFleet.id ? 'Actualizar' : 'Crear' }} flota</button>
      </template>
    </Modal>
  </div>
</template>

<script>
import { Header, StatusBadge, Modal, Pagination } from '@/components/common'
import { fleetService, vehicleService } from '@/services/api'

export default {
  name: 'FleetManagement',
  components: {
    Header,
    StatusBadge,
    Modal,
    Pagination
  },
  data() {
    return {
      fleets: [],
      vehicles: [], // All vehicles for assignment
      currentFleetVehicles: [], // Vehicles of the selected fleet
      selectedFleet: null,
      activeFleetTab: 0,
      fleetTabs: ['Vehículos', 'Conductores', 'Rutas', 'Mantenimiento', 'Estadísticas'],
      fleetVehicleSearch: '',
      fleetVehiclePage: 1,
      itemsPerPage: 5,
      showAssignVehiclesModal: false,
      assignVehicleSearch: '',
      selectedVehiclesToAssign: [],
      selectAllVehicles: false,
      showNewFleetModal: false,
      editingFleet: {
        code: '',
        name: '',
        description: '',
        type: '',
        isActive: true
      },
      loading: false,
      error: null
    }
  },
  computed: {
    totalVehicles() {
      return this.fleets.reduce((total, fleet) => total + (fleet.vehicleCount || 0), 0)
    },
    fleetVehicles() {
      return this.currentFleetVehicles
    },
    filteredFleetVehicles() {
      if (!this.fleetVehicleSearch) {
        return this.fleetVehicles
      }

      const query = this.fleetVehicleSearch.toLowerCase()
      return this.fleetVehicles.filter(v =>
          (v.licensePlate || v.plate || '').toLowerCase().includes(query) ||
          v.model.toLowerCase().includes(query) ||
          (v.assignedDriver && v.assignedDriver.toLowerCase().includes(query))
      )
    },
    paginatedFleetVehicles() {
      const start = (this.fleetVehiclePage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.filteredFleetVehicles.slice(start, end)
    },
    availableVehicles() {
if (!this.vehicles || !Array.isArray(this.vehicles)) return [];

    return this.vehicles.filter(v => {
      // 1. Filtro de búsqueda por texto
      if (this.assignVehicleSearch) {
        const query = this.assignVehicleSearch.toLowerCase();
        const matchesPlate = (v.licensePlate || v.plate || '').toLowerCase().includes(query);
        const matchesModel = v.model && v.model.toLowerCase().includes(query);
        
        if (!matchesPlate && !matchesModel) {
          return false;
        }
      }

      // 2. Filtro: Excluir los que YA están en esta flota
      // Convertimos a String para asegurar comparación "1" == 1
      const isInCurrentFleet = this.currentFleetVehicles.some(
        fv => String(fv.id) === String(v.id)
      );
      
      // Opcional: Si tu lógica de negocio dice que un vehículo solo puede estar
      // en UNA flota a la vez, deberías filtrar también los que tengan v.fleetId != null
      // return !isInCurrentFleet && !v.fleetId; 
      
      return !isInCurrentFleet;
    });
    }
  },
  
  methods: {
    async loadFleets() {
      this.loading = true
      this.error = null
      try {
        const response = await fleetService.getAll()
        this.fleets = response.data
        if (this.fleets.length > 0 && !this.selectedFleet) {
          this.viewFleet(this.fleets[0])
        }
      } catch (err) {
        console.error('Error loading fleets:', err)
        this.error = 'Error al cargar las flotas.'
      } finally {
        this.loading = false
      }
    },
    async loadAllVehicles() {
      try {
        const response = await vehicleService.getAll()
        this.vehicles = response.data
      } catch (err) {
        console.error('Error loading all vehicles:', err)
      }
    },
    async loadFleetVehicles(fleetId) {
      try {
        const response = await fleetService.getVehicles(fleetId)
        this.currentFleetVehicles = response.data
      } catch (err) {
        console.error('Error loading fleet vehicles:', err)
        this.currentFleetVehicles = []
      }
    },
    getStatusText(isActive) {
      if (typeof isActive === 'boolean') {
        return isActive ? 'Activa' : 'Inactiva'
      }
      // Fallback for string status if needed (e.g. vehicles)
      const statusMap = {
        active: 'Activa',
        inactive: 'Inactiva',
        warning: 'En ruta'
      }
      return statusMap[isActive] || isActive
    },
    getFleetIcon(fleetName) {
      const iconMap = {
        'Flota Principal': 'fas fa-truck',
        'Flota Secundaria': 'fas fa-car',
        'Flota Externa': 'fas fa-shuttle-van'
      }
      return iconMap[fleetName] || 'fas fa-truck-moving'
    },
    getPerformanceColor(performance) {
      if (performance >= 90) return 'var(--color-success)'
      if (performance >= 70) return 'var(--color-warning)'
      return 'var(--color-error)'
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
    viewFleet(fleet) {
      this.selectedFleet = fleet
      this.activeFleetTab = 0
      this.fleetVehiclePage = 1
      this.loadFleetVehicles(fleet.id)
    },
    editFleet(fleet) {
      this.editingFleet = { ...fleet }
      this.showNewFleetModal = true
    },
    async deleteFleet(fleet) {
      if (!confirm(`¿Estás seguro de eliminar la flota ${fleet.name}?`)) return

      try {
        await fleetService.delete(fleet.id)
        this.fleets = this.fleets.filter(f => f.id !== fleet.id)
        if (this.selectedFleet && this.selectedFleet.id === fleet.id) {
          this.selectedFleet = this.fleets.length > 0 ? this.fleets[0] : null
          if (this.selectedFleet) {
            this.viewFleet(this.selectedFleet)
          } else {
            this.currentFleetVehicles = []
          }
        }
        alert('Flota eliminada correctamente')
      } catch (err) {
        console.error('Error deleting fleet:', err)
        alert('Error al eliminar la flota')
      }
    },
    showFleetStats(fleet) {
      this.selectedFleet = fleet
      this.activeFleetTab = 4 // Mostrar pestaña de estadísticas
      this.loadFleetVehicles(fleet.id)
    },
    toggleAllVehicles() {
      if (this.selectAllVehicles) {
        this.selectedVehiclesToAssign = this.availableVehicles.map(v => v.id)
      } else {
        this.selectedVehiclesToAssign = []
      }
    },
    async assignVehicles() {
      if (this.selectedVehiclesToAssign.length === 0) return

try {
    // 1. Llamada al servicio
    await fleetService.assignVehicles(this.selectedFleet.id, this.selectedVehiclesToAssign);

    // 2. Mensaje de éxito
    alert(`Se han asignado ${this.selectedVehiclesToAssign.length} vehículos correctamente.`);

    // 3. Recargar los datos de la flota actual para ver los nuevos vehículos en la tabla
    await this.loadFleetVehicles(this.selectedFleet.id);

    // 4. Actualizar el contador de vehículos en la tarjeta de la flota (Visual)
    // Buscamos la flota en el array principal y actualizamos su contador
    const fleetIndex = this.fleets.findIndex(f => f.id === this.selectedFleet.id);
    if (fleetIndex !== -1) {
      // Opción A: Si el backend devuelve la flota actualizada, úsala.
      // Opción B (Manual): Sumar la cantidad localmente
      this.fleets[fleetIndex].vehicleCount = (this.fleets[fleetIndex].vehicleCount || 0) + this.selectedVehiclesToAssign.length;
      
      // Actualizar también el objeto seleccionado para reflejar cambios en el header del card
      this.selectedFleet = { ...this.fleets[fleetIndex] }; 
    }

    // 5. Cerrar y limpiar
    this.showAssignVehiclesModal = false;
    this.selectedVehiclesToAssign = [];
    this.selectAllVehicles = false;

  } catch (err) {
    console.error('Error assigning vehicles:', err);
    // Mostrar error más detallado si viene del backend
    const msg = err.response?.data?.message || 'Error al asignar vehículos. Verifique que no estén asignados a otra flota.';
    alert(msg);
  } finally {
    this.loading = false;
  }
    },
    async saveFleet() {
      try {
        if (this.editingFleet.id) {
          // Update
          const payload = {
            name: this.editingFleet.name,
            description: this.editingFleet.description,
            type: this.editingFleet.type,
            isActive: this.editingFleet.isActive
          }
          const response = await fleetService.update(this.editingFleet.id, payload)
          const updatedFleet = response.data
          
          const index = this.fleets.findIndex(f => f.id === this.editingFleet.id)
          if (index !== -1) {
            this.fleets.splice(index, 1, updatedFleet)
            if (this.selectedFleet && this.selectedFleet.id === this.editingFleet.id) {
              this.selectedFleet = updatedFleet
            }
          }
        } else {
          // Create
          // Construct payload according to schema
          const payload = {
            code: this.editingFleet.code,
            name: this.editingFleet.name,
            description: this.editingFleet.description,
            type: this.editingFleet.type
          }
          const response = await fleetService.create(payload)
          const newFleet = response.data
          this.fleets.push(newFleet)
          this.viewFleet(newFleet)
        }

        this.showNewFleetModal = false
        this.editingFleet = {
          code: '',
          name: '',
          description: '',
          type: '',
          isActive: true
        }
      } catch (err) {
        console.error('Error saving fleet:', err)
        alert('Error al guardar la flota')
      }
    },
    async openAssignModal() {
this.loading = true;
  try {
    // 1. Cargamos TODOS los vehículos del sistema para poder elegir
    await this.loadAllVehicles();
    
    // 2. Aseguramos que tenemos los vehículos ACTUALES de la flota para filtrar
    // (Por si el usuario no ha refrescado la vista de detalle recientemente)
    if (this.selectedFleet) {
      await this.loadFleetVehicles(this.selectedFleet.id);
    }
    
    this.selectedVehiclesToAssign = [];
    this.selectAllVehicles = false;
    this.showAssignVehiclesModal = true;
  } catch (err) {
    console.error("Error al abrir modal:", err);
    alert("No se pudieron cargar los vehículos disponibles.");
  } finally {
    this.loading = false;
  }
    }
  },
  created() {
    this.loadFleets()
  }
}
</script>