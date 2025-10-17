import { useSelector } from 'react-redux'

import { CreditCardsList } from '@/components/credit-cards-list'
import type { RootState } from '@/store'

export function CreditCardsPage() {
  const selectedWorkspace = useSelector((state: RootState) => state.auth.selectedWorkspace)

  if (!selectedWorkspace) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Nenhum workspace selecionado</h2>
          <p className="text-muted-foreground">
            Selecione um workspace para gerenciar seus cartões de crédito.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Cartões de Crédito</h1>
        <p className="text-muted-foreground">
          Gerencie seus cartões de crédito e acompanhe seus limites e vencimentos.
        </p>
      </div>

      <CreditCardsList workspaceId={selectedWorkspace.id} />
    </div>
  )
}
