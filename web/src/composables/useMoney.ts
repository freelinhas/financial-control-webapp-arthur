import { Money3Component } from 'v-money3'

export const useMoney = () => {
  // Configuração padrão para Real Brasileiro
  const moneyConfig = {
    decimal: ',',
    thousands: '.',
    prefix: 'R$ ',
    suffix: '',
    precision: 2,
    masked: false,
    allowBlank: false,
    min: 0,
    max: 999999999.99,
  }

  // Função para converter string formatada para número
  const unmaskMoney = (value: string): number => {
    if (!value) return 0
    
    // Remove R$, espaços e pontos de milhar
    const cleaned = value
      .replace('R$', '')
      .replace(/\s/g, '')
      .replace(/\./g, '')
      .replace(',', '.')
    
    return parseFloat(cleaned) || 0
  }

  // Função para formatar número para string com máscara
  const formatMoney = (value: number | string): string => {
    const num = typeof value === 'string' ? parseFloat(value) : value
    if (isNaN(num)) return 'R$ 0,00'
    
    return num.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  return {
    moneyConfig,
    unmaskMoney,
    formatMoney,
    Money3Component,
  }
}

