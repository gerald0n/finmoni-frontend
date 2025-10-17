import { useState } from 'react'

import { useToast } from '@/hooks/use-toast'
import { useCreditCardsListQuery, useDeleteCreditCardMutation } from '@/services/credit-cards/hooks'
import type { CreditCard } from '@/types'

interface UseCreditCardsListProps {
  workspaceId: string
}

export function useCreditCardsList({ workspaceId }: UseCreditCardsListProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCard, setEditingCard] = useState<CreditCard | undefined>()
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean
    card: CreditCard | null
  }>({ open: false, card: null })
  const { toast } = useToast()

  const { data: cards = [], isLoading, error } = useCreditCardsListQuery(workspaceId)
  const deleteMutation = useDeleteCreditCardMutation(workspaceId)

  const handleEdit = (card: CreditCard) => {
    setEditingCard(card)
    setModalOpen(true)
  }

  const handleDelete = (card: CreditCard) => {
    setConfirmDialog({ open: true, card })
  }

  const confirmDelete = () => {
    if (confirmDialog.card) {
      deleteMutation.mutate(confirmDialog.card.id, {
        onSuccess: () => {
          toast({
            title: 'Cartão excluído com sucesso',
            description: 'O cartão de crédito foi removido permanentemente.',
          })
        },
        onError: (error) => {
          toast({
            variant: 'destructive',
            title: error instanceof Error ? error.message : 'Erro ao excluir cartão',
            description: 'Tente novamente ou entre em contato com o suporte.',
          })
        },
      })
    }
    setConfirmDialog({ open: false, card: null })
  }

  const handleModalClose = () => {
    setModalOpen(false)
    setEditingCard(undefined)
  }

  const handleNewCard = () => {
    setEditingCard(undefined)
    setModalOpen(true)
  }

  return {
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
  }
}
