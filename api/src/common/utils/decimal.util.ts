import { Decimal } from 'decimal.js'

// Configuração global do Decimal.js para precisão monetária
Decimal.set({ precision: 28, rounding: Decimal.ROUND_HALF_UP })

export class DecimalUtil {
  /**
   * Cria uma instância Decimal.js a partir de um valor
   */
  static create(value: string | number | Decimal): Decimal {
    return new Decimal(value || 0)
  }

  /**
   * Formata um valor monetário para exibição
   */
  static format(value: string | number | Decimal, currency = 'BRL'): string {
    const decimalValue = this.create(value)
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency,
    }).format(decimalValue.toNumber())
  }

  /**
   * Soma dois valores monetários
   */
  static add(a: string | number | Decimal, b: string | number | Decimal): Decimal {
    return this.create(a).add(this.create(b))
  }

  /**
   * Subtrai dois valores monetários
   */
  static subtract(a: string | number | Decimal, b: string | number | Decimal): Decimal {
    return this.create(a).sub(this.create(b))
  }

  /**
   * Multiplica dois valores monetários
   */
  static multiply(a: string | number | Decimal, b: string | number | Decimal): Decimal {
    return this.create(a).mul(this.create(b))
  }

  /**
   * Divide dois valores monetários
   */
  static divide(a: string | number | Decimal, b: string | number | Decimal): Decimal {
    return this.create(a).div(this.create(b))
  }

  /**
   * Compara dois valores monetários
   * Retorna: -1 se a < b, 0 se a = b, 1 se a > b
   */
  static compare(a: string | number | Decimal, b: string | number | Decimal): number {
    return this.create(a).cmp(this.create(b))
  }

  /**
   * Verifica se um valor é zero
   */
  static isZero(value: string | number | Decimal): boolean {
    return this.create(value).isZero()
  }

  /**
   * Verifica se um valor é positivo
   */
  static isPositive(value: string | number | Decimal): boolean {
    return this.create(value).isPositive()
  }

  /**
   * Verifica se um valor é negativo
   */
  static isNegative(value: string | number | Decimal): boolean {
    return this.create(value).isNegative()
  }

  /**
   * Converte um valor Decimal.js para string com precisão fixa
   */
  static toString(value: Decimal, decimalPlaces = 2): string {
    return value.toFixed(decimalPlaces)
  }

  /**
   * Converte um valor Decimal.js para número (use com cuidado devido à precisão)
   */
  static toNumber(value: Decimal): number {
    return value.toNumber()
  }

  /**
   * Arredonda um valor para 2 casas decimais
   */
  static round(value: string | number | Decimal): Decimal {
    return this.create(value).toDecimalPlaces(2)
  }
}
