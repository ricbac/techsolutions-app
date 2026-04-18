# TechSolutions S.A. — Sistema Web Empresarial

Sistema web full-stack para la gestión de clientes, proyectos y tareas de la empresa TechSolutions S.A.

## Tecnologías Utilizadas

### Frontend
- React + Vite
- Tailwind CSS
- Axios
- React Router DOM

### Backend
- Node.js
- Express
- JSON Web Token (JWT)
- Bcryptjs

### Base de Datos
- PostgreSQL (Supabase)

### Despliegue
- Frontend: Vercel
- Backend: Render

---

## Funcionalidades

- Autenticación de usuarios con JWT
- Gestión de Clientes (CRUD completo)
- Gestión de Proyectos (CRUD completo)
- Gestión de Tareas (CRUD completo)
- Dashboard con estadísticas en tiempo real
- Interfaz responsiva

---

## 🗄️ Modelo de Base de Datos

tb_Usuarios     → Roles del sistema
tb_Clientes     → Información de clientes
tb_Proyectos    → Proyectos asociados a clientes
tb_Tareas       → Tareas asociadas a proyectos

---

## Instalación y Ejecución Local

### Requisitos previos
- Node.js v18 o superior
- Cuenta en Supabase

### 1. Clonar el repositorio
```bash
git clone https://github.com/TU_USUARIO/techsolutions-app.git
cd techsolutions-app
```

### 2. Configurar el Backend
```bash
cd backend
npm install
```

Crear archivo `.env` con las siguientes variables:

PORT=4000
JWT_SECRET=techsolutions_secret_key_2024
DATABASE_URL=tu_url_de_supabase

Ejecutar el servidor:
```bash
node index.js
```

### 3. Configurar el Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## Variables de Entorno

### Backend (.env)
| Variable | Descripción |
|----------|-------------|
| PORT | Puerto del servidor (4000) |
| JWT_SECRET | Clave secreta para tokens JWT |
| DATABASE_URL | URL de conexión a Supabase |

---

## Credenciales de Prueba

| Campo | Valor |
|-------|-------|
| Correo | admin@techsolutions.com |
| Contraseña | password |

---

## Estructura del Proyecto

techsolutions/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Clientes.jsx
│   │   │   ├── Proyectos.jsx
│   │   │   └── Tareas.jsx
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   └── App.jsx
│   └── package.json
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   ├── index.js
│   └── package.json
└── README.md

---

## Seguridad

- Contraseñas encriptadas con Bcryptjs
- Autenticación mediante JWT con expiración de 8 horas
- Rutas protegidas en frontend y backend
- Variables sensibles en archivo .env

---

## Autor

Desarrollado como proyecto integrador Full-Stack — TechSolutions S.A.