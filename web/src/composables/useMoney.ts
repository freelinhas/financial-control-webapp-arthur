import { Big } from 'big.js'

// Configuração global do Big.js para precisão monetária
Big.DP = 2 // 2 casas decimais
Big.RM = Big.roundHalfUp // Arredondamento para cima quando necessário

export function useMoney() {
  /**
   * Cria uma instância Big.js a partir de um valor
   */
  const create = (value: string | number | Big): Big => {
    return new Big(value || 0)
  }

  /**
   * Formata um valor monetário para exibição
   */
  const format = (value: string | number | Big, currency = 'BRL'): string => {
    const bigValue = create(value)
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency,
    }).format(Number(bigValue.toString()))
  }

  /**
   * Soma dois valores monetários
   */
  const add = (a: string | number | Big, b: string | number | Big): Big => {
    return create(a).add(create(b))
  }

  /**
   * Subtrai dois valores monetários
   */
  const subtract = (a: string | number | Big, b: string | number | Big): Big => {
    return create(a).sub(create(b))
  }

  /**
   * Multiplica dois valores monetários
   */
  const multiply = (a: string | number | Big, b: string | number | Big): Big => {
    return create(a).mul(create(b))
  }

  /**
   * Divide dois valores monetários
   */
  const divide = (a: string | number | Big, b: string | number | Big): Big => {
    return create(a).div(create(b))
  }

  /**
   * Compara dois valores monetários
   * Retorna: -1 se a < b, 0 se a = b, 1 se a > b
   */
  const compare = (a: string | number | Big, b: string | number | Big): number => {
    return create(a).cmp(create(b))
  }

  /**
   * Verifica se um valor é zero
   */
  const isZero = (value: string | number | Big): boolean => {
    return create(value).eq(0)
  }

  /**
   * Verifica se um valor é positivo
   */
  const isPositive = (value: string | number | Big): boolean => {
    return create(value).gt(0)
  }

  /**
   * Verifica se um valor é negativo
   */
  const isNegative = (value: string | number | Big): boolean => {
    return create(value).lt(0)
  }

  /**
   * Converte um valor Big.js para string com precisão fixa
   */
  const toString = (value: Big): string => {
    return value.toFixed(2)
  }

  /**
   * Converte um valor Big.js para número (use com cuidado devido à precisão)
   */
  const toNumber = (value: Big): number => {
    return Number(value.toString())
  }

  return {
    create,
    format,
    add,
    subtract,
    multiply,
    divide,
    compare,
    isZero,
    isPositive,
    isNegative,
    toString,
    toNumber,
  }
}