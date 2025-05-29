import * as v from 'valibot';

export const RegisterSchema = v.pipe(
    v.object({
        email: v.pipe(
            v.string(),
            v.minLength(1, 'El Email es obligatorio'),
            v.email('Email no válido')
        ),
        name: v.pipe(
            v.string(),
            v.minLength(1, 'Tu nombre no puede ir vacio')
        ),
        password: v.pipe(
            v.string(),
            v.minLength(8, 'El password es muy corto, mínimo 8 caracteres')
        ),
        password_confirmation: v.string(),
    }),
    v.forward(
        v.check(
            (data) => data.password === data.password_confirmation,
            'Los passwords no son iguales'
        ),
        ['password_confirmation']
    )
);

export const LoginSchema = v.object({
    email: v.pipe(
        v.string(),
        v.minLength(1, 'El Email es Obligatorio'),
        v.email('Email no válido')
    ),
    password: v.pipe(
        v.string(),
        v.minLength(1, 'El Password no puede ir vacio')
    )
});

export const TokenSchema = v.pipe(
    v.string('Token no válido'),
    v.length(6, 'Token no válido')
);

export const ForgotPasswordSchema = v.object({
    email: v.pipe(
        v.string(),
        v.minLength(1, 'El Email es Obligatorio'),
        v.email('Email no válido')
    ),
});

export const ResetPasswordSchema = v.pipe(
    v.object({
        password: v.pipe(
            v.string(),
            v.minLength(8, 'El Password debe ser de al menos 8 caracteres')
        ),
        password_confirmation: v.string()
    }),
    v.forward(
        v.check(
            (data) => data.password === data.password_confirmation,
            'Los Passwords no son iguales'
        ),
        ['password_confirmation']
    )
);

export const DraftBudgetSchema = v.object({
    name: v.pipe(
        v.string(),
        v.minLength(1, 'El Nombre del presupuesto es obligatorio')
    ),
    amount: v.pipe(
        v.union([v.string(), v.number()]),
        v.transform(Number),
        v.number('Cantidad no válida'),
        v.minValue(1, 'Cantidad no válida')
    ),
});

export const PasswordValidationSchema = v.pipe(
    v.string(),
    v.minLength(1, 'Password no válido')
);

export const DraftExpenseSchema = v.object({
    name: v.pipe(
        v.string(),
        v.minLength(1, 'El nombre del gasto es obligatorio')
    ),
    amount: v.pipe(
        v.union([v.string(), v.number()]),
        v.transform(Number),
        v.number(),
        v.minValue(1, 'Cantidad no válida')
    )
});

export const UpdatePasswordSchema = v.pipe(
    v.object({
        current_password: v.pipe(
            v.string(),
            v.minLength(1, 'El Password no puede ir vacio')
        ),
        password: v.pipe(
            v.string(),
            v.minLength(8, 'El Nuevo Password debe ser de al menos 8 caracteres')
        ),
        password_confirmation: v.string()
    }),
    v.forward(
        v.check(
            (data) => data.password === data.password_confirmation,
            'Los Passwords no son iguales'
        ),
        ['password_confirmation']
    )
);

export const ProfileFormSchema = v.object({
    name: v.pipe(
        v.string(),
        v.minLength(1, 'Tu Nombre no puede ir vacio')
    ),
    email: v.pipe(
        v.string(),
        v.minLength(1, 'El Email es Obligatorio'),
        v.email('Email no válido')
    ),
});

export const SuccessSchema = v.string();

export const ErrorResponseSchema = v.object({
    error: v.string()
});

export const UserSchema = v.object({
    id: v.number(),
    name: v.string(),
    email: v.pipe(v.string(), v.email())
});

export const ExpenseAPIResponseSchema = v.object({
    id: v.number(),
    name: v.string(),
    amount: v.number(),
    createdAt: v.string(),
    updatedAt: v.string(),
    budgetId: v.number()
});

export const BudgetAPIResponseSchema = v.object({
    id: v.number(),
    name: v.string(),
    amount: v.number(),
    userId: v.number(),
    createdAt: v.string(),
    updatedAt: v.string(),
    expenses: v.array(ExpenseAPIResponseSchema)
});

export const BudgetsAPIResponseSchema = v.array(
    v.omit(BudgetAPIResponseSchema, ['expenses'])
);

// Types
export type User = v.InferOutput<typeof UserSchema>;
export type Budget = v.InferOutput<typeof BudgetAPIResponseSchema>;
export type DraftExpense = v.InferOutput<typeof DraftExpenseSchema>;
export type Expense = v.InferOutput<typeof ExpenseAPIResponseSchema>;