import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { CreditCardsListSkeleton } from '@/components/ui/skeleton'
import { useCreditCardsList } from '@/hooks/use-credit-cards-list'

import { CreditCardItem } from './credit-card-item'
import { CreditCardModal } from './credit-card-modal'
import { EmptyCreditCardList } from './empty-credit-card-list'

interface CreditCardsListProps {
  workspaceId: string
}

export function CreditCardsList({ workspaceId }: CreditCardsListProps) {
  const {
    cards,
    isLoading,
    error,
    modalOpen,
    editingCard,
    confirmDialog,
    handleEdit,
    handleDelete,
    confirmDelete,
    handleModalClose,
    handleNewCard,
    setConfirmDialog,
  } = useCreditCardsList({ workspaceId })

  if (error) {
    return (
      <Card>
        <CardContent className="py-6">
          <p className="text-center text-red-600">
            Erro ao carregar cartões de crédito
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Cartões de Crédito</h2>
        <Button onClick={handleNewCard}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Cartão
        </Button>
      </div>

      {isLoading ? (
        <CreditCardsListSkeleton />
      ) : cards.length === 0 ? (
        <EmptyCreditCardList onNewCard={handleNewCard} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {cards.map((card) => (
            <CreditCardItem
              key={card.id}
              card={card}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <CreditCardModal
        open={modalOpen}
        onOpenChange={handleModalClose}
        workspaceId={workspaceId}
        {...(editingCard && { card: editingCard })}
      />

      <ConfirmDialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}
        title="Excluir Cartão de Crédito"
        description={`Tem certeza que deseja excluir o cartão "${confirmDialog.card?.name}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
        variant="destructive"
        onConfirm={confirmDelete}
      />
    </div>
  )
}
