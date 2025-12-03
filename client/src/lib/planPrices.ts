// Gerenciador centralizado de preços dos planos
// IMPORTANTE: Mercado Pago exige valores mínimos (recomendado R$ 5,00+)
export const DEFAULT_PLAN_PRICES = {
  premium_mensal: 5.00,
  premium_anual: 60.00,
};

// Cache dos preços (em memória)
let cachedPrices: typeof DEFAULT_PLAN_PRICES | null = null;
let fetchPromise: Promise<typeof DEFAULT_PLAN_PRICES> | null = null;

export async function fetchPlanPricesFromServer(): Promise<typeof DEFAULT_PLAN_PRICES> {
  // Se já tem uma requisição em andamento, retornar a mesma promise
  if (fetchPromise) {
    return fetchPromise;
  }

  fetchPromise = (async () => {
    try {
      console.log('🔄 [PLAN_PRICES] Buscando do servidor...');
      
      const response = await fetch('/api/plan-prices', {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ [PLAN_PRICES] Recebido do servidor:', data);
        
        // Validar que os valores são números válidos
        if (typeof data.premium_mensal === 'number' && 
            typeof data.premium_anual === 'number' &&
            data.premium_mensal > 0 && 
            data.premium_anual > 0) {
          cachedPrices = data;
          localStorage.setItem('planos_precos', JSON.stringify(data));
          return data;
        }
      }
    } catch (error) {
      console.error('❌ [PLAN_PRICES] Erro ao buscar do servidor:', error);
    } finally {
      fetchPromise = null;
    }
    
    return DEFAULT_PLAN_PRICES;
  })();

  return fetchPromise;
}

export function getPlanPrices() {
  // 1. Se tem cache em memória, usar cache
  if (cachedPrices) {
    return cachedPrices;
  }

  // 2. Tentar carregar do localStorage
  const customPrices = localStorage.getItem('planos_precos');
  if (customPrices) {
    try {
      const parsed = JSON.parse(customPrices);
      
      // Validar que os valores são válidos
      if (typeof parsed.premium_mensal === 'number' && 
          typeof parsed.premium_anual === 'number' &&
          parsed.premium_mensal > 0 && 
          parsed.premium_anual > 0) {
        cachedPrices = {
          premium_mensal: parsed.premium_mensal,
          premium_anual: parsed.premium_anual,
        };
        return cachedPrices;
      }
    } catch (error) {
      console.error('❌ [PLAN_PRICES] Erro ao carregar do localStorage:', error);
    }
  }

  // 3. Retornar preços padrão
  return DEFAULT_PLAN_PRICES;
}

// Atualizar cache quando necessário
export function updatePlanPricesCache(prices: typeof DEFAULT_PLAN_PRICES) {
  console.log('💾 [PLAN_PRICES] Atualizando cache:', prices);
  cachedPrices = prices;
  localStorage.setItem('planos_precos', JSON.stringify(prices));
}

// Limpar cache (útil para forçar atualização)
export function clearPlanPricesCache() {
  console.log('🗑️ [PLAN_PRICES] Limpando cache');
  cachedPrices = null;
  localStorage.removeItem('planos_precos');
}

export function formatPrice(price: number): string {
  return `R$ ${price.toFixed(2).replace('.', ',')}`;
}

export function calculateAnnualSavings(monthlyPrice: number, annualPrice: number): number {
  return (monthlyPrice * 12) - annualPrice;
}