// Tipos para a BrasilAPI
export interface BankFromAPI {
  ispb: string
  name: string
  code: number
  fullName: string
}

export interface BankOption {
  value: string
  label: string
  code: number
  ispb: string
}

/**
 * Serviço para consumir a BrasilAPI e obter informações dos bancos
 */
export class BrasilAPIService {
  private static readonly BASE_URL = 'https://brasilapi.com.br/api'

  /**
   * Busca todos os bancos disponíveis no Brasil
   */
  static async getBanks(): Promise<BankFromAPI[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/banks/v1`)
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar bancos: ${response.status}`)
      }
      
      const banks: BankFromAPI[] = await response.json()
      return banks
    } catch {
      throw new Error('Não foi possível carregar a lista de bancos')
    }
  }

  /**
   * Converte os bancos da API para o formato usado no Select
   */
  static formatBanksForSelect(banks: BankFromAPI[]): BankOption[] {
    if (!banks || banks.length === 0) {
      return []
    }

    return banks
      .filter(bank => bank && bank.code !== null && bank.code !== undefined && bank.name) // Filtrar bancos válidos
      .map(bank => ({
        value: bank.code.toString(), // Manter o código original
        label: `${bank.code.toString().padStart(3, '0')} - ${bank.name}`,
        code: bank.code,
        ispb: bank.ispb,
      }))
      .sort((a, b) => a.label.localeCompare(b.label)) // Ordenar alfabeticamente
  }

  /**
   * Busca um banco específico pelo código
   */
  static async getBankByCode(code: string): Promise<BankFromAPI | null> {
    try {
      const banks = await this.getBanks()
      return banks.find(bank => bank.code.toString() === code) || null
    } catch {
      return null
    }
  }
}