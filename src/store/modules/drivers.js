import { driverService } from '@/services/api'

export default {
  namespaced: true,
  state: {
    drivers: [],
    selectedDriver: null,
    loaded: false
  },
  getters: {
    allDrivers: state => state.drivers,
    activeDrivers: state => state.drivers.filter(d => d.status === 'active'),
    driverCount: state => state.drivers.length,
    expiringLicenses: state => {
      const today = new Date()
      const inThirtyDays = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
      
      return state.drivers.filter(driver => {
        const expiryDate = new Date(driver.license.expiry)
        return expiryDate > today && expiryDate <= inThirtyDays
      })
    }
  },
  mutations: {
    SET_DRIVERS(state, drivers) {
      state.drivers = drivers
      state.loaded = true
    },
    SET_SELECTED_DRIVER(state, driver) {
      state.selectedDriver = driver
    },
    ADD_DRIVER(state, driver) {
      state.drivers.push(driver)
    },
    UPDATE_DRIVER(state, updatedDriver) {
      const index = state.drivers.findIndex(d => d.id === updatedDriver.id)
      if (index !== -1) {
        state.drivers.splice(index, 1, updatedDriver)
      }
    },
    DELETE_DRIVER(state, id) {
      state.drivers = state.drivers.filter(d => d.id !== id)
    }
  },
  actions: {
    async fetchDrivers({ commit, state }) {
      if (!state.loaded) {
        try {
          commit('SET_LOADING', true, { root: true })
          const response = await driverService.getAll()
          commit('SET_DRIVERS', response.data)
          return response.data
        } catch (error) {
          console.error('Error fetching drivers:', error)
          commit('showNotification', {
            message: 'Error al obtener conductores',
            type: 'error'
          }, { root: true })
          throw error
        } finally {
          commit('SET_LOADING', false, { root: true })
        }
      }
      return state.drivers
    },
    async fetchDriver({ commit }, id) {
      try {
        commit('SET_LOADING', true, { root: true })
        const response = await driverService.getById(id)
        commit('SET_SELECTED_DRIVER', response.data)
        return response.data
      } catch (error) {
        console.error(`Error fetching driver ${id}:`, error)
        commit('showNotification', {
          message: 'Error al obtener detalles del conductor',
          type: 'error'
        }, { root: true })
        throw error
      } finally {
        commit('SET_LOADING', false, { root: true })
      }
    },
    async createDriver({ commit }, driverData) {
      try {
        commit('SET_LOADING', true, { root: true })
        const response = await driverService.create(driverData)
        commit('ADD_DRIVER', response.data)
        commit('showNotification', {
          message: 'Conductor creado correctamente',
          type: 'success'
        }, { root: true })
        return response.data
      } catch (error) {
        console.error('Error creating driver:', error)
        commit('showNotification', {
          message: 'Error al crear conductor',
          type: 'error'
        }, { root: true })
        throw error
      } finally {
        commit('SET_LOADING', false, { root: true })
      }
    },
    async updateDriver({ commit }, driverData) {
      try {
        commit('SET_LOADING', true, { root: true })
        const response = await driverService.update(driverData.id, driverData)
        commit('UPDATE_DRIVER', response.data)
        commit('showNotification', {
          message: 'Conductor actualizado correctamente',
          type: 'success'
        }, { root: true })
        return response.data
      } catch (error) {
        console.error(`Error updating driver ${driverData.id}:`, error)
        commit('showNotification', {
          message: 'Error al actualizar conductor',
          type: 'error'
        }, { root: true })
        throw error
      } finally {
        commit('SET_LOADING', false, { root: true })
      }
    },
    async deleteDriver({ commit }, id) {
      try {
        commit('SET_LOADING', true, { root: true })
        await driverService.delete(id)
        commit('DELETE_DRIVER', id)
        commit('showNotification', {
          message: 'Conductor eliminado correctamente',
          type: 'success'
        }, { root: true })
        return { success: true }
      } catch (error) {
        console.error(`Error deleting driver ${id}:`, error)
        commit('showNotification', {
          message: 'Error al eliminar conductor',
          type: 'error'
        }, { root: true })
        throw error
      } finally {
        commit('SET_LOADING', false, { root: true })
      }
    }
  }
}
