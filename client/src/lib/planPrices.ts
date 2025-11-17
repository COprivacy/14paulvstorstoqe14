
// Gerenciador centralizado de preços dos planos
export const DEFAULT_PLAN_PRICES = {
  premium_mensal: 79.99,
  premium_anual: 767.04,
};

export function getPlanPrices() {
  const savedPrices = localStorage.getItem('planos_precos');
  
  if (savedPrices) {
    try {
      const parsed = JSON.parse(savedPrices);
      return {
        premium_mensal: parsed.premium_mensal || DEFAULT_PLAN_PRICES.premium_mensal,
        premium_anual: parsed.premium_anual || DEFAULT_PLAN_PRICES.premium_anual,
      };
    } catch (error) {
      console.error('Erro ao carregar preços salvos:', error);
      return DEFAULT_PLAN_PRICES;
    }
  }
  
  return DEFAULT_PLAN_PRICES;
}

export function formatPrice(price: number): string {
  return `R$ ${price.toFixed(2).replace('.', ',')}`;
}

export function calculateAnnualSavings(monthlyPrice: number, annualPrice: number): number {
  return (monthlyPrice * 12) - annualPrice;
}
