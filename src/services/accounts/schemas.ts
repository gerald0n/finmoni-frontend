import { z } from 'zod'

// Schema de validação para criação/edição de conta bancária
export const bankAccountSchema = z.object({
  name: z
    .string()
    .min(1, 'Nome/descrição da conta é obrigatório')
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  
  bankCode: z
    .string()
    .min(1, 'Banco é obrigatório')
    .refine((val) => {
      // Validar que é um código de banco válido (números apenas)
      return /^\d+$/.test(val) && parseInt(val) > 0
    }, 'Código do banco deve ser um número válido'),
  
  ownerId: z
    .string()
    .optional()
    .or(z.literal('')), // Permite string vazia
  
  initialBalance: z
    .string()
    .optional()
    .refine((val) => {
      if (!val || val.trim() === '') return true
      // Validar formato de moeda brasileira (aceita vírgula ou ponto)
      const normalized = val.trim().replace(',', '.')
      const number = parseFloat(normalized)
      return !isNaN(number) && number >= 0
    }, 'Formato inválido. Use formato: 1234,56')
    .transform((val) => {
      if (!val || val.trim() === '') return undefined
      return val.trim()
    }),
  
  agency: z
    .string()
    .optional()
    .refine((val) => {
      if (!val || val.trim() === '') return true
      // Validar que contém apenas números e hífens
      return /^[\d-]+$/.test(val)
    }, 'Agência deve conter apenas números e hífens')
    .transform((val) => {
      if (!val || val.trim() === '') return undefined
      return val.trim()
    }),
  
  account: z
    .string()
    .optional()
    .refine((val) => {
      if (!val || val.trim() === '') return true
      // Validar que contém apenas números e hífens
      return /^[\d-]+$/.test(val)
    }, 'Número da conta deve conter apenas números e hífens')
    .transform((val) => {
      if (!val || val.trim() === '') return undefined
      return val.trim()
    }),
})

export type BankAccountFormData = z.infer<typeof bankAccountSchema>

// Schema para o select de proprietários
export const ownerSelectSchema = z.object({
  value: z.string(),
  label: z.string(),
  role: z.string().optional(),
})

export type OwnerSelectOption = z.infer<typeof ownerSelectSchema>