import { CreditCard, Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface EmptyCreditCardListProps {
    onNewCard: () => void
}

export function EmptyCreditCardList({ onNewCard }: EmptyCreditCardListProps) {
    return (
        <Card>
            <CardContent className="py-12">
                <div className="text-center">
                    <CreditCard className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                        Nenhum cartão de crédito cadastrado
                    </h3>
                    <p className="text-muted-foreground mb-4">
                        Comece criando seu primeiro cartão de crédito para controlar suas despesas.
                    </p>
                    <Button onClick={onNewCard}>
                        <Plus className="mr-2 h-4 w-4" />
                        Criar Primeiro Cartão
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
