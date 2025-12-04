<template>
  <form @submit.prevent="handleSubmit" id="vehicleForm">
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem;">
      <div class="form-group">
        <label for="licensePlate" class="form-label">Número de placa *</label>
        <input type="text" id="licensePlate" class="form-control" v-model="vehicle.licensePlate" required>
      </div>

      <div class="form-group">
        <label for="brand" class="form-label">Marca *</label>
        <input type="text" id="brand" class="form-control" v-model="vehicle.brand" required>
      </div>
      
      <div class="form-group">
        <label for="model" class="form-label">Modelo *</label>
        <input type="text" id="model" class="form-control" v-model="vehicle.model" required>
      </div>
      
      <div class="form-group">
        <label for="year" class="form-label">Año *</label>
        <input type="number" id="year" class="form-control" v-model.number="vehicle.year" required>
      </div>
      
      <div class="form-group">
        <label for="mileage" class="form-label">Kilometraje inicial *</label>
        <input type="number" id="mileage" class="form-control" v-model.number="vehicle.mileage" required>
      </div>
      
      <div class="form-group">
        <label for="status" class="form-label">Estado</label>
        <select id="status" class="form-control" v-model="vehicle.status">
          <option value="active">Activo</option>
          <option value="inactive">Mantenimiento</option>
          <option value="warning">En ruta</option>
        </select>
      </div>
      
      <div class="form-group">
        <label for="fleetId" class="form-label">ID Flota</label>
        <select id="fleetId" class="form-control" v-model.number="vehicle.fleetId">
          <option :value="0">Sin asignar</option>
          <option v-for="fleet in fleets" :key="fleet.id" :value="fleet.id">
            {{ fleet.name }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="driverId" class="form-label">ID Conductor</label>
        <select id="driverId" class="form-control" v-model.number="vehicle.driverId">
          <option :value="0">Sin asignar</option>
          <option v-for="driver in drivers" :key="driver.id" :value="driver.id">
            {{ driver.name }}
          </option>
        </select>
      </div>
    </div>
    
    <div class="form-group">
      <label for="notes" class="form-label">Notas adicionales</label>
      <textarea id="notes" class="form-control" rows="3" v-model="vehicle.notes"></textarea>
    </div>
    
    <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.25rem;">
      <button type="button" class="btn btn-secondary" @click="$emit('cancel')">Cancelar</button>
      <button type="submit" class="btn btn-primary">{{ isEdit ? 'Actualizar' : 'Guardar' }} vehículo</button>
    </div>
  </form>
</template>

<script>
export default {
  name: 'VehicleForm',
  props: {
    fleets: {
      type: Array,
      default: () => []
    },
    drivers: {
      type: Array,
      default: () => []
    },
    vehicleData: {
      type: Object,
      default: () => ({
        licensePlate: '',
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        mileage: 0,
        status: 'active',
        fleetId: 0,
        driverId: 0,
        notes: ''
      })
    }
  },
  data() {
    return {
      vehicle: { ...this.vehicleData }
    }
  },
  computed: {
    isEdit() {
      return !!this.vehicleData.id
    }
  },
  methods: {
    handleSubmit() {
      this.$emit('submit', { ...this.vehicle })
    }
  },
  watch: {
    vehicleData(newValue) {
      this.vehicle = { ...newValue }
    }
  }
}
</script>