
/**
 * Utilitários de Segurança para localStorage
 * Protege contra XSS e vazamento de dados sensíveis
 */

// Lista de campos sensíveis que NUNCA devem ser armazenados
const SENSITIVE_FIELDS = ['senha', 'password', 'token', 'secret'];

/**
 * Remove campos sensíveis de um objeto
 */
export function sanitizeData<T extends Record<string, any>>(data: T): Partial<T> {
  const sanitized = { ...data };
  
  SENSITIVE_FIELDS.forEach(field => {
    if (field in sanitized) {
      delete sanitized[field];
    }
  });
  
  return sanitized;
}

/**
 * Salva dados no localStorage de forma segura
 */
export function secureSetItem(key: string, value: any): void {
  try {
    const sanitized = typeof value === 'object' ? sanitizeData(value) : value;
    localStorage.setItem(key, JSON.stringify(sanitized));
  } catch (error) {
    console.error('Erro ao salvar no localStorage:', error);
  }
}

/**
 * Recupera dados do localStorage de forma segura
 */
export function secureGetItem<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(key);
    if (!item) return null;
    
    const parsed = JSON.parse(item);
    // Garantir que campos sensíveis não existem
    return sanitizeData(parsed) as T;
  } catch (error) {
    console.error('Erro ao ler do localStorage:', error);
    return null;
  }
}

/**
 * Limpa todos os dados sensíveis do localStorage
 */
export function clearSensitiveData(): void {
  try {
    const user = localStorage.getItem('user');
    if (user) {
      const parsed = JSON.parse(user);
      const sanitized = sanitizeData(parsed);
      localStorage.setItem('user', JSON.stringify(sanitized));
    }
  } catch (error) {
    console.error('Erro ao limpar dados sensíveis:', error);
  }
}

// Executar limpeza automática ao carregar
if (typeof window !== 'undefined') {
  clearSensitiveData();
}
