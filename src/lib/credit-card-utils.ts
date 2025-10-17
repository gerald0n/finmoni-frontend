import React from 'react'

import {
  VisaIcon,
  MastercardIcon,
  EloIcon,
  AmexIcon,
  HipercardIcon,
  DinersIcon
} from '@/components/card-brands'
import type { CreditCard } from '@/types'

// Função para obter o componente de ícone da bandeira
export const getBrandIcon = (brand?: string) => {
  const brandIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    VISA: VisaIcon,
    MASTERCARD: MastercardIcon,
    ELO: EloIcon,
    AMEX: AmexIcon,
    HIPERCARD: HipercardIcon,
    DINERS: DinersIcon,
  }
  return brand ? brandIcons[brand] : null
}

// Função para formatar o número do cartão
export const formatCardNumber = (lastFourDigits?: string) => {
  if (lastFourDigits) {
    return `**** **** **** ${lastFourDigits}`
  }
  return '**** **** **** ****'
}

// Função para obter o nome do titular
export const getHolderName = (card: CreditCard) => {
  if (card.cardType === 'HOLDER' && card.owner) {
    return card.owner.name
  }
  if (card.cardType === 'THIRD_PARTY' && card.holderName) {
    return card.holderName
  }
  return 'Titular'
}

// Função para formatar o tipo do cartão
export const getCardTypeLabel = (cardType: 'HOLDER' | 'THIRD_PARTY') => {
  return cardType === 'HOLDER' ? 'Titular' : 'Terceiros'
}
