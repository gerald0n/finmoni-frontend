import { z } from 'zod'

export const creditCardFormSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Nome do cartão é obrigatório')
      .min(3, 'Nome deve ter pelo menos 3 caracteres')
      .max(100, 'Nome deve ter no máximo 100 caracteres'),

    cardType: z.enum(['HOLDER', 'THIRD_PARTY'] as const, {
      required_error: 'Tipo do cartão é obrigatório',
    }),

    brand: z.enum(['VISA', 'MASTERCARD', 'ELO', 'AMEX', 'HIPERCARD', 'DINERS'] as const).optional(),

    holderName: z.string().optional(),

    workspaceUserId: z.string().optional().or(z.literal('')),

    bankCode: z.string().optional().or(z.literal('')),

    lastFourDigits: z
      .string()
      .optional()
      .refine(
        (val) => {
          if (!val || val.trim() === '') return true
          return /^\d{4}$/.test(val.trim())
        },
        'Deve conter exatamente 4 dígitos',
      ),

    creditLimit: z
      .string()
      .optional()
      .refine(
        (val) => {
          if (!val || val.trim() === '') return true
          const normalized = val.trim().replace(',', '.')
          const number = parseFloat(normalized)
          return !isNaN(number) && number >= 0
        },
        'Formato inválido. Use formato: 1234,56',
      ),

    dueDate: z
      .string({
        required_error: 'Dia de vencimento é obrigatório',
      })
      .min(1, 'Dia de vencimento é obrigatório')
      .refine(
        (val) => {
          const num = parseInt(val, 10)
          return !isNaN(num) && num >= 1 && num <= 31
        },
        {
          message: 'Dia de vencimento deve estar entre 1 e 31',
        },
      ),
  })
  .superRefine((data, ctx) => {
    if (data.cardType === 'HOLDER') {
      if (!data.workspaceUserId || data.workspaceUserId.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Titular é obrigatório para cartões próprios',
          path: ['workspaceUserId'],
        })
      }

      if (!data.bankCode || data.bankCode.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Banco é obrigatório para cartões próprios',
          path: ['bankCode'],
        })
      }

      if (!data.creditLimit || data.creditLimit.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Limite do cartão é obrigatório para cartões próprios',
          path: ['creditLimit'],
        })
      }

      if (data.holderName && data.holderName.trim() !== '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Nome do titular não deve ser preenchido para cartões próprios',
          path: ['holderName'],
        })
      }
    }
  })

export type CreditCardFormData = z.infer<typeof creditCardFormSchema>

export const cardTypeSelectSchema = z.object({
  value: z.enum(['HOLDER', 'THIRD_PARTY'] as const),
  label: z.string(),
})

export type CardTypeSelectOption = z.infer<typeof cardTypeSelectSchema>

export const cardTypeOptions: CardTypeSelectOption[] = [
  { value: 'HOLDER', label: 'Titular' },
  { value: 'THIRD_PARTY', label: 'Terceiros' },
]

export const holderSelectSchema = z.object({
  value: z.string(),
  label: z.string(),
  role: z.string().optional(),
})

export type HolderSelectOption = z.infer<typeof holderSelectSchema>

export const cardBrandSelectSchema = z.object({
  value: z.enum(['VISA', 'MASTERCARD', 'ELO', 'AMEX', 'HIPERCARD', 'DINERS'] as const),
  label: z.string(),
})

export type CardBrandSelectOption = z.infer<typeof cardBrandSelectSchema>

export const cardBrandOptions: CardBrandSelectOption[] = [
  { value: 'VISA', label: 'Visa' },
  { value: 'MASTERCARD', label: 'Mastercard' },
  { value: 'ELO', label: 'Elo' },
  { value: 'AMEX', label: 'American Express' },
  { value: 'HIPERCARD', label: 'Hipercard' },
  { value: 'DINERS', label: 'Diners Club' },
]
