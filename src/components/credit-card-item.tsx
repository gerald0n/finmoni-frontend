import {
    getBrandIcon,
    formatCardNumber,
    getHolderName,
    getCardTypeLabel,
} from '@/lib/credit-card-utils'
import { formatCurrency } from '@/lib/utils'
import type { CreditCard as CreditCardType } from '@/types'

import { CreditCardActions } from './credit-card-actions'

interface CreditCardItemProps {
    card: CreditCardType
    onEdit: (card: CreditCardType) => void
    onDelete: (card: CreditCardType) => void
}

export function CreditCardItem({ card, onEdit, onDelete }: CreditCardItemProps) {
    const BrandIcon = getBrandIcon(card.brand)

    return (
        <div className="relative group aspect-[1.586/1] w-full max-w-xs rounded-lg p-3 shadow-lg bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 text-white flex flex-col justify-between overflow-hidden text-sm">
            {/* Padrão de fundo decorativo */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white"></div>
                <div className="absolute -left-8 -bottom-8 w-24 h-24 rounded-full bg-white"></div>
            </div>

            {/* Botão de ações */}
            <CreditCardActions card={card} onEdit={onEdit} onDelete={onDelete} />

            {/* Conteúdo do card */}
            <div className="relative z-10 flex flex-col h-full justify-between">
                {/* Topo: Número do cartão */}
                <div className="font-mono text-xl tracking-wider">
                    {formatCardNumber(card.lastFourDigits)}
                </div>

                {/* Meio: Nome do titular e tipo */}
                <div className="space-y-0.5">
                    <div className="text-xs uppercase tracking-wide text-white/60">
                        {card.name}
                    </div>
                    <div className="text-sm font-semibold uppercase tracking-wide">
                        {getHolderName(card)}
                    </div>
                    <div className="text-xs text-white/60">
                        {getCardTypeLabel(card.cardType)}
                    </div>
                </div>

                {/* Base: Limite, Vencimento e Bandeira */}
                <div className="flex items-end justify-between text-xs">
                    <div className="flex gap-3">
                        <div className="space-y-0.5">
                            <div className="text-white/60 uppercase tracking-wide">Venc.</div>
                            <div className="font-semibold">Dia {card.dueDate}</div>
                        </div>
                        {card.cardType === 'HOLDER' &&
                            card.creditLimitCents !== null &&
                            card.creditLimitCents !== undefined && (
                                <div className="space-y-0.5">
                                    <div className="text-white/60 uppercase tracking-wide">Limite</div>
                                    <div className="font-semibold">{formatCurrency(card.creditLimitCents / 100)}</div>
                                </div>
                            )}
                    </div>
                    {BrandIcon && <BrandIcon className="h-8" />}
                </div>
            </div>
        </div>
    )
}
