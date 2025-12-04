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
        <label for="fleetId" class="form-label">ID Flota</label>
        <select id="fleetId" class="form-control" v-model.number="vehicle.fleetId">
          <option :value=null>Sin asignar</option>
          <option v-for="fleet in fleets" :key="fleet.id" :value="fleet.id">
            {{ fleet.name }}
          </option>
        </select>
      </div>
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
        fleetId: 0,
        driverId: 0
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