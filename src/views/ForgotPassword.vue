<template>
  <div style="background-color: var(--color-gray-light); display:flex; justify-content:center; align-items:center; height:100vh;">
    <div class="login-container">
      <div class="login-logo">
        <img src="@/assets/img/logo.png" alt="NovaTrack Logo" class="logo-image">
      </div>

      <form id="forgotForm" @submit.prevent="submitForgot">
        <h2 style="margin-bottom:1rem; text-align:center;">Recuperar contraseña</h2>

        <div class="form-group">
          <label for="email" class="form-label">Correo electrónico</label>
          <div style="position: relative;">
            <i class="fas fa-envelope" style="position:absolute; left:10px; top:12px; color:#666"></i>
            <input type="email" id="email" class="form-control" placeholder="correo@empresa.com" style="padding-left:35px;" v-model="email" required>
          </div>
        </div>

        <div class="form-group">
          <button type="submit" class="btn btn-primary">Enviar enlace de recuperación</button>
        </div>

        <div class="form-group" style="text-align:center; margin-top:0.5rem;">
          <router-link to="/login" class="auth-link">Volver al inicio de sesión</router-link>
        </div>

        <div v-if="message" style="margin-top:1rem; text-align:center; color:var(--brand-2);">{{ message }}</div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ForgotPassword',
  data() {
    return {
      email: '',
      message: ''
    }
  },
  methods: {
    submitForgot() {
      // Simular envío de correo
      this.message = `Se ha enviado un enlace de recuperación a ${this.email}`
      setTimeout(() => { this.$router.push('/login') }, 2500)
    }
  }
}
</script>

