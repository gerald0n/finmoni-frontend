import { Building, CreditCard, User } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { SelectFormField, TextFormField } from '@/components/ui/form-fields'
import { useBankAccountForm } from '@/hooks/use-bank-account-form'
import { useBanksQuery } from '@/hooks/use-banks'
import { useWorkspaceMembersQuery } from '@/services/accounts/hooks'
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
  const { form, isEditing, isLoading, onSubmit } = useBankAccountForm({
    workspaceId,
    account,
    onSuccess: () => onOpenChange(false),
  })

  // Hooks para buscar dados para os selects
  const { data: members = [], isLoading: loadingMembers } =
    useWorkspaceMembersQuery(workspaceId)
  const { data: banks = [], isLoading: loadingBanks } = useBanksQuery()

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

  const handleClose = () => {
    onOpenChange(false)
    form.reset()
  }

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
              {isLoading && (
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-foreground" />
              )}
              {isEditing ? 'Atualizar' : 'Criar'} Conta
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}