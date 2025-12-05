<template>
  <nav class="sidebar">
    <div class="logo-container">
      <img src="@/assets/img/logo.png" alt="NovaTrack Logo" class="logo-image">
    </div>
    
    <ul class="menu">
      <li class="menu-item" v-for="item in menuItems" :key="item.path">
        <router-link :to="item.path" class="menu-link" :class="{ active: $route.path === item.path }">
          <i :class="['fas', item.icon, 'menu-icon']"></i>
          <span class="menu-text">{{ item.label }}</span>
        </router-link>
      </li>


      <li class="menu-item" style="margin-top: 3rem;">
        <a href="#" class="menu-link" @click.prevent="logout">
          <i class="fas fa-sign-out-alt menu-icon"></i>
          <span class="menu-text">Cerrar sesión</span>
        </a>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'Sidebar',
  data() {
    return {
      menuItems: [
        { label: 'Dashboard', path: '/', icon: 'fa-tachometer-alt' },
        { label: 'Gestión de Flota', path: '/fleet-management', icon: 'fa-truck-moving' },
        { label: 'Vehículos', path: '/vehicle-management', icon: 'fa-car' },
        { label: 'Conductores', path: '/driver-management', icon: 'fa-id-card' },
        { label: 'Reportes', path: '/reporting', icon: 'fa-chart-bar' },
        { label: 'Monitoreo', path: '/monitoring', icon: 'fa-eye' },
        { label: 'Analytics AI', path: '/analytics', icon: 'fa-brain' }
      ]
    }
  },
  methods: {
    logout() {
      if (confirm('¿Está seguro que desea cerrar sesión?')) {
        this.$router.push('/login')
      }
    }
  }
}
</script>