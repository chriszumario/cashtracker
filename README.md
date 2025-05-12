# CashTracker API

![Cobertura de Tests](./public/img/1-coverage.png)

## Descripción

CashTracker es una API RESTful diseñada para gestionar presupuestos y gastos personales. Permite a los usuarios crear cuentas, gestionar múltiples presupuestos y registrar gastos asociados a cada presupuesto, facilitando el seguimiento financiero personal.

## Características Principales

- **Autenticación de usuarios**: Registro, inicio de sesión y confirmación de cuentas
- **Gestión de presupuestos**: Crear, leer, actualizar y eliminar presupuestos
- **Control de gastos**: Añadir, consultar, modificar y eliminar gastos asociados a presupuestos
- **Validación de datos**: Middleware para validar entradas y gestionar errores
- **Seguridad**: Autenticación mediante JWT y protección de rutas
- **Base de datos**: Modelo relacional con PostgreSQL y Prisma ORM

## Tecnologías Utilizadas

- **Runtime**: [Bun](https://bun.sh) - Un entorno de ejecución JavaScript rápido y completo
- **Framework**: Express.js
- **Base de datos**: PostgreSQL
- **ORM**: Prisma
- **Autenticación**: JWT (JSON Web Tokens)
- **Testing**: Bun Test con cobertura de código
- **Validación**: Express Validator

## Estructura del Proyecto

```
api/
├── prisma/               # Esquema de base de datos y seeds
├── src/
│   ├── config/           # Configuraciones (env, prisma, etc.)
│   ├── controllers/      # Controladores de la API
│   ├── data/             # Datos y utilidades para la base de datos
│   ├── emails/           # Plantillas y funciones para envío de emails
│   ├── middleware/       # Middleware (auth, validación, etc.)
│   ├── routes/           # Definición de rutas
│   ├── utils/            # Utilidades generales
│   ├── index.ts          # Punto de entrada de la aplicación
│   └── server.ts         # Configuración del servidor Express
└── tests/
    ├── fixtures/         # Datos de prueba
    ├── integration/      # Tests de integración
    ├── mocks/            # Mocks para testing
    ├── setup/            # Configuración de tests
    └── unit/             # Tests unitarios
```

## Modelos de Datos

La API utiliza tres modelos principales:

### Usuario (User)

```prisma
model User {
  id        Int      @id @default(autoincrement())
  name      String
  password  String
  email     String   @unique
  token     String?
  confirmed Boolean  @default(false)
  budgets   Budget[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Presupuesto (Budget)

```prisma
model Budget {
  id        Int       @id @default(autoincrement())
  name      String
  amount    Float
  userId    Int
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: Cascade)
  expenses  Expense[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}
```

### Gasto (Expense)

```prisma
model Expense {
  id        Int      @id @default(autoincrement())
  name      String
  amount    Float
  budgetId  Int
  budget    Budget   @relation(fields: [budgetId], references: [id], onDelete: Cascade, onUpdate: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Endpoints de la API

### Autenticación

- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión
- `GET /api/auth/confirm/:token` - Confirmación de cuenta

### Presupuestos

- `GET /api/budgets` - Obtener todos los presupuestos del usuario
- `POST /api/budgets` - Crear un nuevo presupuesto
- `GET /api/budgets/:budgetId` - Obtener un presupuesto específico
- `PATCH /api/budgets/:budgetId` - Actualizar un presupuesto
- `DELETE /api/budgets/:budgetId` - Eliminar un presupuesto

### Gastos

- `POST /api/budgets/:budgetId/expenses` - Crear un nuevo gasto
- `GET /api/budgets/:budgetId/expenses/:expenseId` - Obtener un gasto específico
- `PATCH /api/budgets/:budgetId/expenses/:expenseId` - Actualizar un gasto
- `DELETE /api/budgets/:budgetId/expenses/:expenseId` - Eliminar un gasto

## Middleware

La API utiliza varios middleware para garantizar la seguridad y validación:

- **authenticate**: Verifica la autenticación del usuario mediante JWT
- **validateBudgetExists**: Comprueba que el presupuesto existe
- **hasAccess**: Verifica que el usuario tiene acceso al presupuesto
- **validateExpenseExists**: Comprueba que el gasto existe
- **belongsToBudget**: Verifica que el gasto pertenece al presupuesto
- **handleInputErrors**: Gestiona errores de validación de entrada

## Tests

El proyecto cuenta con una amplia cobertura de tests unitarios e integración:

### Cobertura de Tests

![Cobertura de Tests](./public/img/1-coverage.png)

### Tests Unitarios

Los tests unitarios verifican el funcionamiento correcto de los controladores y middleware de forma aislada.

![Tests Unitarios](./public/img/2-unit.png)

Ejemplo de test unitario para el controlador de gastos:

```typescript
describe('ExpensesController.create', () => {
    test('should create a new expense', async () => {
        // Arrange
        const req = createRequest({
            method: 'POST',
            url: '/api/budgets/:budgetId/expenses',
            body: NEW_EXPENSE,
            budget: { id: BUDGET_ID },
        });
        const res = createResponse();

        // Mock the create method
        prismaMock.expense.create.mockResolvedValue({
            ...NEW_EXPENSE,
            id: 1,
            budgetId: BUDGET_ID,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        // Act
        await ExpensesController.create(req, res);

        // Assert
        expect(prismaMock.expense.create).toHaveBeenCalledWith({
            data: {
                ...NEW_EXPENSE,
                budgetId: BUDGET_ID,
            },
        });
        expect(res.statusCode).toBe(201);
        expect(res._getJSONData()).toEqual('Gasto Agregado Correctamente');
    });
});
```

### Tests de Integración

Los tests de integración verifican el funcionamiento correcto de la API completa, incluyendo rutas, controladores y middleware.

![Tests de Integración](./public/img/3-integration.png)

## Instalación y Configuración

### Requisitos Previos

- [Bun](https://bun.sh) v1.2.4 o superior
- PostgreSQL

### Pasos de Instalación

1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/cashtracker.git
cd cashtracker/api
```

2. Instalar dependencias

```bash
bun install
```

3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/cashtracker"
JWT_SECRET="tu_secreto_jwt"
BASE_URL="http://localhost"
PORT=3000
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=tu_email@example.com
EMAIL_PASS=tu_contraseña
FRONTEND_URL=http://localhost:5173
```

4. Configurar la base de datos

```bash
bun run db:migrate
bun run db:seed
```

5. Iniciar el servidor

```bash
bun run dev
```

## Ejecución de Tests

```bash
# Ejecutar todos los tests
bun test

# Ejecutar tests con modo watch
bun test --watch

# Ejecutar tests con cobertura
bun run test:coverage
```

## Contribución

Si deseas contribuir a este proyecto, por favor:

1. Haz un fork del repositorio
2. Crea una rama para tu característica (`git checkout -b feature/amazing-feature`)
3. Haz commit de tus cambios (`git commit -m 'Add some amazing feature'`)
4. Haz push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo LICENSE para más detalles.