<template>
  <div style="background-color: var(--color-gray-light); display: flex; justify-content: center; align-items: center; height: 100vh;">
    <div class="login-container">
      <div class="login-logo">
        <div style="display: flex; justify-content: center; align-items: center;">
          <img src="@/assets/img/logo.png" alt="NovaTrack Logo" class="logo-image">
        </div>
      </div>

      <form id="registerForm" @submit.prevent="register">
        <div class="form-group">
          <label for="name" class="form-label">Nombre completo</label>
          <div style="position: relative;">
            <i class="fas fa-user" style="position: absolute; left: 10px; top: 12px; color: #666;"></i>
            <input
              type="text"
              id="name"
              class="form-control"
              placeholder="Nombre y apellidos"
              style="padding-left: 35px;"
              v-model="form.name"
              required
            >
          </div>
        </div>

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
              v-model="form.email"
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
              v-model="form.password"
              required
            >
          </div>
        </div>

        <div class="form-group">
          <label for="confirmPassword" class="form-label">Confirmar contraseña</label>
          <div style="position: relative;">
            <i class="fas fa-lock" style="position: absolute; left: 10px; top: 12px; color: #666;"></i>
            <input
              type="password"
              id="confirmPassword"
              class="form-control"
              placeholder="Repita su contraseña"
              style="padding-left: 35px;"
              v-model="form.confirmPassword"
              required
            >
          </div>
        </div>

        <div v-if="error" style="color: #c0392b; margin-bottom: 0.5rem;">{{ error }}</div>

        <div class="form-group">
          <button type="submit" class="btn btn-primary" style="width: 100%;">Crear Cuenta</button>
        </div>

        <div class="form-group" style="text-align: center; margin-top: 0.5rem;">
          <router-link to="/login" style="color: var(--color-turquoise); text-decoration: none;">¿Ya tienes cuenta? Iniciar sesión</router-link>
        </div>
      </form>

      <div style="text-align: center; margin-top: 1.5rem; color: #666;">
        <p>© 2025 NovaTrack - AutoLogix</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Register',
  data() {
    return {
      form: {
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      },
      error: ''
    }
  },
  methods: {
    register() {
      this.error = ''
      if (!this.form.name || !this.form.email || !this.form.password || !this.form.confirmPassword) {
        this.error = 'Por favor complete todos los campos.'
        return
      }
      if (this.form.password !== this.form.confirmPassword) {
        this.error = 'Las contraseñas no coinciden.'
        return
      }
      // Simular registro exitoso
      // En una app real aquí se haría llamada a la API y manejo de errores
      this.$router.push('/login')
    }
  }
}
</script>
