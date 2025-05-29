# CashTracker - Aplicación Web de Gestión de Presupuestos

CashTracker es una aplicación web moderna para la gestión de presupuestos personales, desarrollada con Next.js y TypeScript. Permite a los usuarios crear presupuestos, registrar gastos y mantener un control detallado de sus finanzas personales.

## Características Principales

- **Autenticación de Usuarios**: Sistema completo de registro, inicio de sesión y recuperación de contraseña.
- **Gestión de Presupuestos**: Creación, edición y eliminación de presupuestos personalizados.
- **Control de Gastos**: Registro y seguimiento de gastos asociados a cada presupuesto.
- **Panel de Administración**: Interfaz intuitiva para visualizar y gestionar todos los presupuestos.
- **Visualización de Datos**: Representación gráfica del progreso de gastos en cada presupuesto.
- **Diseño Responsivo**: Interfaz adaptable a dispositivos móviles y de escritorio.

## Tecnologías Utilizadas

- **Frontend**:
  - Next.js 15.3.2 (App Router)
  - React 19
  - TypeScript
  - Tailwind CSS 4
  - Headless UI
  - React Toastify
  - React Circular Progressbar

- **Validación de Datos**:
  - Valibot (esquemas de validación)

- **Autenticación**:
  - Sistema basado en JWT (almacenado en cookies)

## Estructura del Proyecto

```
web-app/
├── actions/            # Server Actions para operaciones del lado del servidor
│   ├── auth/           # Acciones de autenticación
│   ├── budget/         # Acciones para gestión de presupuestos
│   └── expense/        # Acciones para gestión de gastos
├── app/                # Estructura de rutas de Next.js (App Router)
│   ├── admin/          # Panel de administración
│   ├── auth/           # Rutas de autenticación
│   └── page.tsx        # Página principal (redirección a /admin)
├── components/         # Componentes reutilizables
│   ├── admin/          # Componentes del panel de administración
│   ├── auth/           # Componentes de autenticación
│   ├── budgets/        # Componentes para gestión de presupuestos
│   ├── expenses/       # Componentes para gestión de gastos
│   ├── profile/        # Componentes para gestión de perfil
│   └── ui/             # Componentes de interfaz de usuario
├── public/             # Archivos estáticos
└── src/                # Código fuente principal
    ├── auth/           # Lógica de autenticación
    ├── schemas/        # Esquemas de validación con Valibot
    ├── services/       # Servicios para comunicación con la API
    └── utils/          # Utilidades (formateo de moneda, fechas, etc.)
```

## Flujo de Autenticación

1. **Registro**: Los usuarios pueden crear una cuenta proporcionando nombre, email y contraseña.
2. **Confirmación de Cuenta**: Verificación mediante código enviado por email.
3. **Inicio de Sesión**: Autenticación mediante email y contraseña.
4. **Recuperación de Contraseña**: Proceso de restablecimiento mediante email.

## Gestión de Presupuestos

- Cada presupuesto tiene un nombre y una cantidad asignada.
- Los usuarios pueden ver todos sus presupuestos en el panel principal.
- Se muestra información sobre la última actualización de cada presupuesto.

## Control de Gastos

- Los gastos se asocian a un presupuesto específico.
- Cada gasto tiene un nombre y una cantidad.
- Se muestra un gráfico circular con el porcentaje de presupuesto utilizado.
- Se calcula automáticamente el monto disponible y gastado.

## Requisitos

- Node.js 18.0 o superior
- Bun (opcional, para mejor rendimiento)

## Instalación

```bash
# Instalar dependencias
npm install
# o con Bun
bun install
```

## Configuración

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```
API_URL=http://localhost:3001  # URL de la API de backend
```

## Ejecución

```bash
# Modo desarrollo
npm run dev
# o con Bun
bun run dev

# Compilar para producción
npm run build
# o con Bun
bun run build

# Iniciar en modo producción
npm start
# o con Bun
bun start
```

## Desarrollo

La aplicación utiliza Server Actions de Next.js para operaciones del lado del servidor, lo que permite una experiencia de desarrollo más fluida y segura. La validación de datos se realiza mediante Valibot tanto en el cliente como en el servidor.

## Idioma

La aplicación está desarrollada en español, incluyendo mensajes de error, etiquetas y textos de la interfaz.

## Licencia

Todos los derechos reservados.