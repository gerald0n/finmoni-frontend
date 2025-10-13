import {
  Plus,
  CreditCard,
  Edit,
  Trash2,
  Building,
  User
} from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { BankAccountsListSkeleton } from '@/components/ui/skeleton'
import { useBanksQuery } from '@/hooks/use-banks'
import { useToast } from '@/hooks/use-toast'
import { useAccountsListQuery, useDeleteAccountMutation } from '@/services/accounts/hooks'
import { accountsUtils } from '@/services/accounts/index'
import type { BankAccount } from '@/types'

import { BankAccountModal } from './bank-account-modal'

interface BankAccountsListProps {
  workspaceId: string
}

export function BankAccountsList({ workspaceId }: BankAccountsListProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [editingAccount, setEditingAccount] = useState<BankAccount | undefined>()
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean
    account: BankAccount | null
  }>({ open: false, account: null })
  const { toast } = useToast()

  // Hooks para API calls
  const { data: accounts = [], isLoading, error } = useAccountsListQuery(workspaceId)
  const { data: banks = [] } = useBanksQuery()
  const deleteMutation = useDeleteAccountMutation(workspaceId)

  const handleEdit = (account: BankAccount) => {
    setEditingAccount(account)
    setModalOpen(true)
  }

  const handleDelete = (account: BankAccount) => {
    setConfirmDialog({ open: true, account })
  }

  const confirmDelete = () => {
    if (confirmDialog.account) {
      deleteMutation.mutate(confirmDialog.account.id, {
        onSuccess: () => {
          toast({
            title: 'Conta excluída com sucesso',
            description: 'A conta bancária foi removida permanentemente.',
          })
        },
        onError: (error) => {
          toast({
            variant: 'destructive',
            title: error instanceof Error ? error.message : 'Erro ao excluir conta',
            description: 'Tente novamente ou entre em contato com o suporte.',
          })
        },
      })
    }
    setConfirmDialog({ open: false, account: null })
  }

  const handleModalClose = () => {
    setModalOpen(false)
    setEditingAccount(undefined)
  }

  // Função para buscar o nome do banco pelo código
  const getBankName = (bankCode: string) => {
    if (!bankCode) return 'Banco não informado'
    const bank = banks.find(b => b.value === bankCode)
    return bank ? bank.label : `Banco ${bankCode}`
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-6">
          <p className="text-center text-red-600">
            Erro ao carregar contas bancárias
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Contas Bancárias</h2>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Conta
        </Button>
      </div>

      {isLoading ? (
        <BankAccountsListSkeleton />
      ) : accounts.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <CreditCard className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Nenhuma conta bancária cadastrada
              </h3>
              <p className="text-muted-foreground mb-4">
                Comece criando sua primeira conta bancária para controlar suas finanças.
              </p>
              <Button onClick={() => setModalOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Criar Primeira Conta
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map((account: BankAccount) => (
            <Card key={account.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-base flex items-center">
                      <CreditCard className="mr-2 h-4 w-4" />
                      {account.name}
                    </CardTitle>
                    {account.bankCode && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Building className="mr-2 h-3 w-3" />
                        <span>{getBankName(account.bankCode)}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(account)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(account)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">

                {account.owner && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <User className="mr-2 h-3 w-3" />
                    <span>{account.owner.name}</span>
                    <span className="ml-2 text-xs border rounded px-2 py-1 bg-muted text-muted-foreground">
                      Proprietário
                    </span>
                  </div>
                )}

                {account.initialBalanceCents !== null && (
                  <div className="flex items-center">
                    <span className="mr-2 text-green-600 font-semibold text-sm">R$</span>
                    <span className="font-semibold">
                      {accountsUtils.centsToCurrency(account.initialBalanceCents || 0)}
                    </span>
                    <span className="ml-2 text-xs bg-muted text-muted-foreground rounded px-2 py-1">
                      Saldo Inicial
                    </span>
                  </div>
                )}

                {(account.agency || account.account) && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Building className="mr-2 h-3 w-3" />
                    <span>
                      {account.agency && `Ag: ${account.agency}`}
                      {account.agency && account.account && ' • '}
                      {account.account && `Conta: ${account.account}`}
                    </span>
                  </div>
                )}

                <div className="text-xs text-muted-foreground">
                  Criada em {new Date(account.createdAt).toLocaleDateString('pt-BR')}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <BankAccountModal
        open={modalOpen}
        onOpenChange={handleModalClose}
        workspaceId={workspaceId}
        {...(editingAccount && { account: editingAccount })}
      />

      <ConfirmDialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}
        title="Excluir Conta Bancária"
        description={`Tem certeza que deseja excluir a conta "${confirmDialog.account?.name}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
        variant="destructive"
        onConfirm={confirmDelete}
      />
    </div>
  )
}