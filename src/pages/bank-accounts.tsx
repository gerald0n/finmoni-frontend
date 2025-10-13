import { useSelector } from 'react-redux'

import { BankAccountsList } from '@/components/bank-accounts-list'
import type { RootState } from '@/store'

export function BankAccountsPage() {
    const selectedWorkspace = useSelector((state: RootState) => state.auth.selectedWorkspace)

    if (!selectedWorkspace) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold mb-2">Nenhum workspace selecionado</h2>
                    <p className="text-muted-foreground">
                        Selecione um workspace para gerenciar suas contas bancárias.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Contas Bancárias</h1>
                <p className="text-muted-foreground">
                    Gerencie suas contas bancárias e acompanhe seus saldos.
                </p>
            </div>

            <BankAccountsList workspaceId={selectedWorkspace.id} />
        </div>
    )
}