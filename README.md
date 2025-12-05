# NovaTrack - Sistema de Gestión de Flotas

**NovaTrack** es una plataforma web integral para la gestión y monitoreo de flotas de vehículos, desarrollada con **Vue.js**. Permite administrar vehículos, conductores y flotas; generar reportes, realizar monitoreo en tiempo real y aplicar análisis predictivo con IA.

---

## ✨ Características

- **Dashboard Centralizado**: Visualización de KPIs y alertas importantes.
- **Gestión de Vehículos**: Administración completa de información de vehículos.
- **Gestión de Conductores**: Seguimiento de licencias, desempeño y asignaciones.
- **Gestión de Flotas**: Organización de vehículos en flotas para una mejor administración.
- **Monitoreo en Tiempo Real**: Visualización de ubicación y estado de vehículos.
- **Reportes Personalizados**: Generación de reportes de rendimiento, consumo y más.
- **Análisis Predictivo**: Predicción de mantenimientos y optimización mediante IA.
- **Diseño Responsivo**: Adaptable a diferentes dispositivos.

---

## 🛠️ Tecnologías Utilizadas

- **Frontend**: Vue.js 2, Vue Router, Vuex  
- **Estilos**: CSS personalizado  
- **Iconos**: Font Awesome  
- **Simulación de Backend**: Mock API con adaptadores  
- **Despliegue**: Firebase Hosting  

---

## 📁 Estructura del Proyecto

```
flota365-vue/
├── public/
│   ├── img/
│   ├── favicon.ico
│   └── index.html
├── src/
│   ├── assets/
│   │   ├── css/
│   │   │   ├── styles.css
│   │   │   └── notifications.css
│   │   └── img/
│   ├── components/
│   │   ├── common/
│   │   ├── vehicles/
│   │   ├── drivers/
│   │   └── analytics/
│   ├── data/
│   ├── router/
│   ├── services/
│   ├── store/
│   ├── views/
│   ├── App.vue
│   └── main.js
├── firebase.json
├── package.json
└── README.md
```

---

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js (v12 o superior)  
- npm (v6 o superior)  

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/flota365.git
cd flota365

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run serve
```

La aplicación estará disponible en `http://localhost:8080`.

---

## 💻 Uso

```bash
# Iniciar servidor de desarrollo
npm run serve

# Compilar para producción
npm run build

# Ejecutar linter
npm run lint
```

### Usuarios Demo

- **Usuario**: `admin@flota365.com`  
- **Contraseña**: `demo123`

---

## 🔥 Despliegue en Firebase

```bash
# Instalar Firebase CLI globalmente
npm install -g firebase-tools

# Iniciar sesión en Firebase
firebase login

# Inicializar Firebase en el proyecto
firebase init
# Selecciona "Hosting", configura "dist" como carpeta pública, y habilita modo SPA

# Compilar
npm run build

# Desplegar
firebase deploy
```

---

## 🧩 Simulación de Backend

El proyecto utiliza adaptadores mock para simular un backend:

- Los datos se encuentran en `/src/data/` como archivos `.json`.
- La simulación de API se realiza mediante `/src/services/mockAdapter.js`.
- Para integrar un backend real, reemplazar lógica en `/src/services/api.js`.

---

## 🗺️ Roadmap

- [ ] Sistema de autenticación real  
- [ ] Integración con mapas (Google Maps / Mapbox)  
- [ ] Módulo de planificación de rutas  
- [ ] Implementación como PWA  
- [ ] Soporte para múltiples idiomas  
- [ ] Integración con dispositivos GPS/OBD  

---

## 👥 Contribución

1. Haz un fork del proyecto  
2. Crea una rama: `git checkout -b feature/nueva-funcionalidad`  
3. Realiza tus cambios y haz commit: `git commit -m 'Add: nueva funcionalidad'`  
4. Sube tu rama: `git push origin feature/nueva-funcionalidad`  
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la [Licencia MIT](LICENSE).


---

© 2025 **NovaTrack** – AutoLogix
