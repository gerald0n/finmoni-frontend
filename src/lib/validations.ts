import { z } from 'zod'

export const authSchemas = {
    login: z.object({
        email: z.string().email('Digite um email válido'),
        password: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres'),
    }),

    register: z.object({
        name: z.string().min(1, 'Nome é obrigatório'),
        email: z.string().email('Digite um email válido'),
        password: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres'),
        confirmPassword: z.string(),
    }).refine((data) => data.password === data.confirmPassword, {
        message: 'As senhas não coincidem',
        path: ['confirmPassword'],
    }),
} as const

export type LoginFormData = z.infer<typeof authSchemas.login>
export type RegisterFormData = z.infer<typeof authSchemas.register>