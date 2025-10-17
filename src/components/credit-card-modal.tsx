import { zodResolver } from '@hookform/resolvers/zod'
import { Building, Calendar, CreditCard as CreditCardIcon, Hash, User } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { TextFormField, SelectFormField } from '@/components/ui/form-fields'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useBanksQuery } from '@/hooks/use-banks'
import {
  useCreateCreditCardMutation,
  useUpdateCreditCardMutation,
  useWorkspaceMembersQuery,
} from '@/services/credit-cards/hooks'
import {
  creditCardFormSchema,
  type CreditCardFormData,
  cardTypeOptions,
  cardBrandOptions,
} from '@/services/credit-cards/schemas'
import type { CreditCard, WorkspaceMember } from '@/types'

interface CreditCardModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  workspaceId: string
  card?: CreditCard // Para edição
}

export function CreditCardModal({
  open,
  onOpenChange,
  workspaceId,
  card,
}: CreditCardModalProps) {
  const isEditing = !!card

  // Hooks para API calls
  const { data: members = [], isLoading: loadingMembers } = useWorkspaceMembersQuery(workspaceId)
  const { data: banks = [], isLoading: loadingBanks } = useBanksQuery()
  const createMutation = useCreateCreditCardMutation(workspaceId)
  const updateMutation = useUpdateCreditCardMutation(workspaceId, card?.id || '')

  // Setup do formulário com react-hook-form e zod
  const form = useForm<CreditCardFormData>({
    resolver: zodResolver(creditCardFormSchema),
    values: card ? {
      name: card.name,
      cardType: card.cardType,
      brand: card.brand || undefined,
      holderName: card.holderName || '',
      workspaceUserId: card.workspaceUserId || '',
      bankCode: card.bankCode || card.bankAccount?.bankCode || '',
      lastFourDigits: card.lastFourDigits || '',
      creditLimit: card.creditLimitCents
        ? (card.creditLimitCents / 100).toFixed(2).replace('.', ',')
        : '',
      dueDate: String(card.dueDate),
    } : {
      name: '',
      cardType: 'HOLDER',
      brand: undefined,
      holderName: '',
      workspaceUserId: '',
      bankCode: '',
      lastFourDigits: '',
      creditLimit: '',
      dueDate: '10',
    },
  })

  // Observar mudanças no cardType
  const cardType = form.watch('cardType')

  // Quando o cardType mudar, resetar os campos incompatíveis
  useEffect(() => {
    if (cardType === 'HOLDER') {
      // Limpar campos de terceiros quando mudar para HOLDER
      form.setValue('holderName', '')
    } else if (cardType === 'THIRD_PARTY') {
      // Para terceiros, não limpar os campos - deixar opcionais
      // Usuário pode preencher ou não
    }
  }, [cardType, form])

  // Preparar opções do select de membros
  const memberOptions = [
    ...(loadingMembers
      ? [{ value: 'loading', label: 'Carregando membros...', disabled: true }]
      : members.map((member: WorkspaceMember) => ({
        value: member.userId,
        label: member.user?.name || 'Usuário sem nome',
        ...(member.user?.email && { sublabel: member.user.email }),
        disabled: false,
      }))),
  ]

  // Handler do submit
  const onSubmit = (data: CreditCardFormData) => {
    const submitData: {
      name: string
      cardType: 'HOLDER' | 'THIRD_PARTY'
      brand?: 'VISA' | 'MASTERCARD' | 'ELO' | 'AMEX' | 'HIPERCARD' | 'DINERS'
      holderName?: string
      workspaceUserId?: string
      bankCode?: string
      lastFourDigits?: string
      creditLimit?: string
      dueDate: number
    } = {
      name: data.name,
      cardType: data.cardType,
      dueDate: parseInt(data.dueDate, 10),
    }

    if (data.brand) submitData.brand = data.brand

    if (data.cardType === 'HOLDER') {
      if (data.workspaceUserId) submitData.workspaceUserId = data.workspaceUserId
      if (data.bankCode) submitData.bankCode = data.bankCode
      if (data.lastFourDigits) submitData.lastFourDigits = data.lastFourDigits
      if (data.creditLimit) submitData.creditLimit = data.creditLimit
    } else {
      // Para THIRD_PARTY, enviar todos os campos preenchidos (todos opcionais)
      if (data.holderName) submitData.holderName = data.holderName
      if (data.workspaceUserId) submitData.workspaceUserId = data.workspaceUserId
      if (data.bankCode) submitData.bankCode = data.bankCode
      if (data.lastFourDigits) submitData.lastFourDigits = data.lastFourDigits
      if (data.creditLimit) submitData.creditLimit = data.creditLimit
    }

    if (isEditing) {
      updateMutation.mutate(submitData, {
        onSuccess: () => {
          onOpenChange(false)
          form.reset()
        },
      })
    } else {
      createMutation.mutate(submitData, {
        onSuccess: () => {
          onOpenChange(false)
          form.reset()
        },
      })
    }
  }

  const handleClose = () => {
    onOpenChange(false)
    form.reset()
  }

  const isLoading = createMutation.isPending || updateMutation.isPending

  // Gerar opções de dias (1-31)
  const dayOptions = Array.from({ length: 31 }, (_, i) => ({
    value: String(i + 1),
    label: `Dia ${i + 1}`,
  }))

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] flex flex-col gap-0 p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle>
            {isEditing ? 'Editar Cartão de Crédito' : 'Novo Cartão de Crédito'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Atualize as informações do cartão de crédito.'
              : 'Crie um novo cartão de crédito para o workspace.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col overflow-hidden">
          <div className="overflow-y-auto pl-6 pr-3 space-y-4 max-h-[calc(90vh-180px)] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-gray-400 dark:[&::-webkit-scrollbar-thumb]:bg-gray-600 dark:[&::-webkit-scrollbar-thumb]:hover:bg-gray-500">
            <SelectFormField
              name="cardType"
              control={form.control}
              label="Tipo do Cartão"
              placeholder="Selecionar tipo"
              options={cardTypeOptions}
              icon={<CreditCardIcon className="h-4 w-4" />}
              required
              description="Selecione se é seu cartão ou de terceiros"
            />

            <TextFormField
              name="name"
              control={form.control}
              label="Nome do Cartão"
              placeholder="Ex: Cartão Pessoal, Cartão Corporativo, etc."
              icon={<CreditCardIcon className="h-4 w-4" />}
              required
              description="Dê um nome personalizado para identificar este cartão"
            />

            <SelectFormField
              name="brand"
              control={form.control}
              label="Bandeira"
              placeholder="Selecionar bandeira"
              options={cardBrandOptions}
              icon={<CreditCardIcon className="h-4 w-4" />}
              description="Selecione a bandeira do cartão"
            />

            {cardType === 'HOLDER' ? (
              <>
                <SelectFormField
                  name="workspaceUserId"
                  control={form.control}
                  label="Titular"
                  placeholder="Selecionar titular"
                  options={memberOptions}
                  icon={<User className="h-4 w-4" />}
                  required
                  description="Selecione o membro proprietário deste cartão"
                />

                <SelectFormField
                  name="bankCode"
                  control={form.control}
                  label="Banco"
                  placeholder={loadingBanks ? 'Carregando...' : 'Selecionar banco'}
                  options={banks}
                  icon={<Building className="h-4 w-4" />}
                  required
                  description="Selecione o banco deste cartão"
                />

                <div className="space-y-2">
                  <Label htmlFor="lastFourDigits">
                    4 Últimos Dígitos
                  </Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <Hash className="h-4 w-4" />
                    </div>
                    <Input
                      id="lastFourDigits"
                      placeholder="1234"
                      className={`pl-10 ${form.formState.errors.lastFourDigits ? 'border-red-500' : ''}`}
                      value={form.watch('lastFourDigits') || ''}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 4)
                        form.setValue('lastFourDigits', value)
                      }}
                      maxLength={4}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Os 4 últimos dígitos do cartão
                  </p>
                  {form.formState.errors.lastFourDigits && (
                    <p className="text-xs text-red-500">
                      {form.formState.errors.lastFourDigits.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="creditLimit">
                    Limite do Cartão <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <span className="text-sm font-medium">R$</span>
                    </div>
                    <Input
                      id="creditLimit"
                      placeholder="0,00"
                      required
                      className={`pl-10 ${form.formState.errors.creditLimit ? 'border-red-500' : ''}`}
                      value={form.watch('creditLimit') || ''}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '')

                        if (value === '') {
                          form.setValue('creditLimit', '')
                          return
                        }

                        const numValue = parseInt(value, 10)
                        const formatted = (numValue / 100).toFixed(2).replace('.', ',')
                        form.setValue('creditLimit', formatted)
                      }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Limite de crédito disponível
                  </p>
                  {form.formState.errors.creditLimit && (
                    <p className="text-xs text-red-500">
                      {form.formState.errors.creditLimit.message}
                    </p>
                  )}
                </div>
              </>
            ) : (
              <>
                <TextFormField
                  name="holderName"
                  control={form.control}
                  label="Nome do Titular"
                  placeholder="Digite o nome do titular (opcional)"
                  icon={<User className="h-4 w-4" />}
                  description="Opcionalmente, informe o nome da pessoa titular do cartão"
                />

                <SelectFormField
                  name="bankCode"
                  control={form.control}
                  label="Banco"
                  placeholder={loadingBanks ? 'Carregando...' : 'Selecionar banco (opcional)'}
                  options={banks}
                  icon={<Building className="h-4 w-4" />}
                  description="Opcionalmente, informe o banco do cartão"
                />

                <div className="space-y-2">
                  <Label htmlFor="lastFourDigits">
                    4 Últimos Dígitos
                  </Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <Hash className="h-4 w-4" />
                    </div>
                    <Input
                      id="lastFourDigits"
                      placeholder="1234"
                      className={`pl-10 ${form.formState.errors.lastFourDigits ? 'border-red-500' : ''}`}
                      value={form.watch('lastFourDigits') || ''}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 4)
                        form.setValue('lastFourDigits', value)
                      }}
                      maxLength={4}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Opcionalmente, os 4 últimos dígitos do cartão
                  </p>
                  {form.formState.errors.lastFourDigits && (
                    <p className="text-xs text-red-500">
                      {form.formState.errors.lastFourDigits.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="creditLimit">
                    Limite do Cartão
                  </Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <span className="text-sm font-medium">R$</span>
                    </div>
                    <Input
                      id="creditLimit"
                      placeholder="0,00"
                      className={`pl-10 ${form.formState.errors.creditLimit ? 'border-red-500' : ''}`}
                      value={form.watch('creditLimit') || ''}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '')

                        if (value === '') {
                          form.setValue('creditLimit', '')
                          return
                        }

                        const numValue = parseInt(value, 10)
                        const formatted = (numValue / 100).toFixed(2).replace('.', ',')
                        form.setValue('creditLimit', formatted)
                      }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Opcionalmente, informe o limite de crédito
                  </p>
                  {form.formState.errors.creditLimit && (
                    <p className="text-xs text-red-500">
                      {form.formState.errors.creditLimit.message}
                    </p>
                  )}
                </div>
              </>
            )}

            <SelectFormField
              name="dueDate"
              control={form.control}
              label="Dia do Vencimento"
              placeholder="Selecione o dia"
              options={dayOptions}
              icon={<Calendar className="h-4 w-4" />}
              required
              description="Dia do mês em que a fatura vence"
            />
          </div>

          <DialogFooter className="px-6 pb-6 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && (
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-foreground" />
              )}
              {isEditing ? 'Atualizar' : 'Criar'} Cartão
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
