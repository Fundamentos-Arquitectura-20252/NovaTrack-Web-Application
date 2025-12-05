<template>
  <div id="app" class="container">
    <Sidebar v-if="!isLoginPage" />
    <main class="main-content" :style="{ marginLeft: !isLoginPage ? '250px' : '0' }">
      <router-view />
      <Notification ref="notification" />
    </main>
  </div>
</template>

<script>
import { Sidebar, Notification } from '@/components/common'

export default {
  name: 'App',
  components: {
    Sidebar,
    Notification
  },
  computed: {
    // Ocultar la barra lateral en las páginas de autenticación (Login y Register)
    isLoginPage() {
      // Preferir meta.layout cuando esté definido en la ruta
      if (this.$route && this.$route.meta && this.$route.meta.layout === 'auth') {
        return true
      }
      const authPages = ['Login', 'Register']
      const pathAuth = ['/login', '/register']
      const currentPath = (this.$route && this.$route.path) ? this.$route.path.toLowerCase() : ''
      const isByName = this.$route && authPages.includes(this.$route.name)
      const isByPath = pathAuth.some(p => currentPath.startsWith(p))
      return isByName || isByPath
    }
  },
  methods: {
    // Método global para mostrar notificaciones
    showNotification(message, type = 'info', duration = 5000) {
      this.$refs.notification.addNotification(message, type, duration)
    }
  }
}
</script>

<style>
@import '@/assets/css/styles.css';
@import '@/assets/css/notifications.css';
</style>