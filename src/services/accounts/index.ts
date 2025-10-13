export * from './api'
export * from './hooks'
export * from './schemas'

// Serviços de API
export * from './api'
export * from './hooks'
export * from './schemas'

// Utilitários específicos para contas bancárias
export const accountsUtils = {
  /**
   * Converte centavos para formato de moeda brasileira
   */
  centsToCurrency: (cents: number): string => {
    return (cents / 100).toFixed(2).replace('.', ',')
  },

  /**
   * Converte valor em formato string para centavos
   */
  currencyToCents: (value: string): number => {
    const numericValue = value.replace(',', '.').replace(/[^\d.-]/g, '')
    return Math.round(parseFloat(numericValue || '0') * 100)
  },

  /**
   * Formata valor para exibição com símbolo R$
   */
  formatCurrency: (cents: number): string => {
    return `R$ ${accountsUtils.centsToCurrency(cents)}`
  }
}