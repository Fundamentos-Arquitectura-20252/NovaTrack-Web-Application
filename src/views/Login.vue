<template>
  <div style="background-color: var(--color-gray-light); display: flex; justify-content: center; align-items: center; height: 100vh;">
    <div class="login-container">
      <div class="login-logo">
        <div style="display: flex; justify-content: center; align-items: center;">
          <img src="@/assets/img/logo.png" alt="Flota365 Logo" class="logo-image">
        </div>
      </div>
      
      <form id="loginForm" @submit.prevent="login">
        <div class="form-group">
          <label for="email" class="form-label">Correo electrónico</label>
          <div style="position: relative;">
            <i class="fas fa-envelope" style="position: absolute; left: 10px; top: 12px; color: #666;"></i>
            <input 
              type="email" 
              id="email" 
              class="form-control" 
              placeholder="correo@empresa.com" 
              style="padding-left: 35px;" 
              v-model="credentials.email"
              required
            >
          </div>
        </div>
        
        <div class="form-group">
          <label for="password" class="form-label">Contraseña</label>
          <div style="position: relative;">
            <i class="fas fa-lock" style="position: absolute; left: 10px; top: 12px; color: #666;"></i>
            <input 
              type="password" 
              id="password" 
              class="form-control" 
              placeholder="Ingrese su contraseña" 
              style="padding-left: 35px;" 
              v-model="credentials.password"
              required
            >
          </div>
        </div>
        
        <div class="form-group" style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <input type="checkbox" id="remember" v-model="credentials.remember">
            <label for="remember">Recordarme</label>
          </div>
          <a href="#" style="color: var(--color-turquoise); text-decoration: none;">¿Olvidó su contraseña?</a>
        </div>
        
        <div class="form-group">
          <button type="submit" class="btn btn-primary" style="width: 100%;">Iniciar Sesión</button>
        </div>
      </form>
      
      <div style="text-align: center; margin-top: 1.5rem; color: #666;">
        <p>© 2025 Flota365 - VSC-Visionaries</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      credentials: {
        email: '',
        password: '',
        remember: false
      }
    }
  },
  methods: {
    login() {
      // Simular autenticación
      if (this.credentials.email && this.credentials.password) {
        // Normalmente aquí iría una llamada a la API
        this.$router.push('/')
      }
    }
  }
}
</script>
