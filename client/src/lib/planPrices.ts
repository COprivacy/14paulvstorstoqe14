// Gerenciador centralizado de preços dos planos
export const DEFAULT_PLAN_PRICES = {
  premium_mensal: 79.99,
  premium_anual: 767.04,
};

// Cache dos preços
let cachedPrices: typeof DEFAULT_PLAN_PRICES | null = null;

export async function fetchPlanPricesFromServer(): Promise<typeof DEFAULT_PLAN_PRICES> {
  try {
    const response = await fetch('/api/plan-prices');
    if (response.ok) {
      const data = await response.json();
      cachedPrices = data;
      return data;
    }
  } catch (error) {
    console.error('Erro ao buscar preços do servidor:', error);
  }
  return DEFAULT_PLAN_PRICES;
}

export function getPlanPrices() {
  // Se tem cache, usar cache
  if (cachedPrices) {
    return cachedPrices;
  }

  // Tentar carregar preços customizados do localStorage (fallback)
  const customPrices = localStorage.getItem('planos_precos');
  if (customPrices) {
    try {
      const parsed = JSON.parse(customPrices);
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

// Atualizar cache quando necessário
export function updatePlanPricesCache(prices: typeof DEFAULT_PLAN_PRICES) {
  cachedPrices = prices;
  localStorage.setItem('planos_precos', JSON.stringify(prices));
}

export function formatPrice(price: number): string {
  return `R$ ${price.toFixed(2).replace('.', ',')}`;
}

export function calculateAnnualSavings(monthlyPrice: number, annualPrice: number): number {
  return (monthlyPrice * 12) - annualPrice;
}