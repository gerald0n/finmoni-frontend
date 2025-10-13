import { zodResolver } from '@hookform/resolvers/zod'
import { Building, CreditCard, User } from 'lucide-react'
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
import { useBanksQuery } from '@/hooks/use-banks'
import {
  useCreateAccountMutation,
  useUpdateAccountMutation,
  useWorkspaceMembersQuery
} from '@/services/accounts/hooks'
import { accountsUtils } from '@/services/accounts/index'
import { bankAccountSchema, type BankAccountFormData } from '@/services/accounts/schemas'
import type { BankAccount, WorkspaceMember } from '@/types'

interface BankAccountModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  workspaceId: string
  account?: BankAccount // Para edição
}

export function BankAccountModal({
  open,
  onOpenChange,
  workspaceId,
  account,
}: BankAccountModalProps) {
  const isEditing = !!account

  // Hooks para API calls
  const { data: members = [], isLoading: loadingMembers } = useWorkspaceMembersQuery(workspaceId)
  const { data: banks = [], isLoading: loadingBanks } = useBanksQuery()
  const createMutation = useCreateAccountMutation(workspaceId)
  const updateMutation = useUpdateAccountMutation(workspaceId, account?.id || '')

  // Setup do formulário com react-hook-form e zod
  const form = useForm<BankAccountFormData>({
    resolver: zodResolver(bankAccountSchema),
    defaultValues: {
      name: '',
      bankCode: '',
      ownerId: '',
      initialBalance: '',
      agency: '',
      account: '',
    },
  })

  // Carregar dados da conta para edição
  useEffect(() => {
    if (account) {
      form.reset({
        name: account.name,
        bankCode: account.bankCode || '',
        ownerId: account.ownerId || '',
        initialBalance: account.initialBalanceCents
          ? accountsUtils.centsToCurrency(account.initialBalanceCents)
          : '',
        agency: account.agency || '',
        account: account.account || '',
      })
    } else {
      form.reset({
        name: '',
        bankCode: '',
        ownerId: '',
        initialBalance: '',
        agency: '',
        account: '',
      })
    }
  }, [account, form])

  // Preparar opções do select de membros
  const memberOptions = [
    ...(loadingMembers
      ? [{ value: 'loading', label: 'Carregando membros...', disabled: true }]
      : members.map((member: WorkspaceMember) => ({
        value: member.userId,
        label: member.user?.name || 'Usuário sem nome',
        ...(member.user?.email && { sublabel: member.user.email }),
        disabled: false,
      }))
    ),
  ]

  // Handler do submit
  const onSubmit = (data: BankAccountFormData) => {
    const submitData = {
      name: data.name,
      bankCode: data.bankCode,
      ...(data.ownerId && { ownerId: data.ownerId }),
      ...(data.initialBalance && { initialBalance: data.initialBalance }),
      ...(data.agency && { agency: data.agency }),
      ...(data.account && { account: data.account }),
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

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Conta Bancária' : 'Nova Conta Bancária'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Atualize as informações da conta bancária.'
              : 'Crie uma nova conta bancária para o workspace.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <TextFormField
            name="name"
            control={form.control}
            label="Nome/Descrição da Conta"
            placeholder="Ex: Conta Corrente Principal, Conta Poupança, etc."
            icon={<CreditCard className="h-4 w-4" />}
            required
            description="Dê um nome personalizado para identificar esta conta"
          />

          <SelectFormField
            name="bankCode"
            control={form.control}
            label="Banco"
            placeholder={loadingBanks ? 'Carregando...' : 'Selecionar banco'}
            options={banks}
            icon={<Building className="h-4 w-4" />}
            required
            description="Selecione o banco desta conta"
          />

          <SelectFormField
            name="ownerId"
            control={form.control}
            label="Proprietário"
            placeholder="Selecionar proprietário (opcional)"
            options={memberOptions}
            icon={<User className="h-4 w-4" />}
            description="Selecione um membro do workspace como proprietário da conta (opcional)."
          />

          <TextFormField
            name="initialBalance"
            control={form.control}
            label="Saldo Inicial"
            placeholder="0,00"
            icon={<span className="text-sm font-medium">R$</span>}
          />

          <div className="grid grid-cols-2 gap-4">
            <TextFormField
              name="agency"
              control={form.control}
              label="Agência"
              placeholder="0000"
              icon={<Building className="h-4 w-4" />}
            />

            <TextFormField
              name="account"
              control={form.control}
              label="Número da Conta"
              placeholder="00000-0"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-foreground" />}
              {isEditing ? 'Atualizar' : 'Criar'} Conta
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}