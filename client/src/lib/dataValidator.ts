
/**
 * Sistema de Validação de Dados
 * Valida e sanitiza dados antes de renderizar na UI
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  sanitized?: any;
}

/**
 * Valida dados de produto
 */
export function validateProduct(product: any): ValidationResult {
  const errors: string[] = [];

  if (!product) {
    return { isValid: false, errors: ['Produto é nulo ou indefinido'] };
  }

  if (!product.id) errors.push('ID do produto está faltando');
  if (typeof product.quantidade !== 'number') errors.push('Quantidade inválida');
  if (typeof product.preco !== 'number') errors.push('Preço inválido');
  if (!product.nome || product.nome.trim() === '') errors.push('Nome do produto está vazio');

  const sanitized = {
    ...product,
    quantidade: Number(product.quantidade) || 0,
    preco: Number(product.preco) || 0,
    estoque_minimo: Number(product.estoque_minimo) || 0,
  };

  return {
    isValid: errors.length === 0,
    errors,
    sanitized,
  };
}

/**
 * Valida dados de venda
 */
export function validateVenda(venda: any): ValidationResult {
  const errors: string[] = [];

  if (!venda) {
    return { isValid: false, errors: ['Venda é nula ou indefinida'] };
  }

  if (!venda.id) errors.push('ID da venda está faltando');
  if (!venda.data) errors.push('Data da venda está faltando');
  if (typeof venda.valor_total !== 'number') errors.push('Valor total inválido');

  // Validar formato de data
  try {
    const date = new Date(venda.data);
    if (isNaN(date.getTime())) {
      errors.push('Formato de data inválido');
    }
  } catch (error) {
    errors.push('Erro ao processar data');
  }

  const sanitized = {
    ...venda,
    valor_total: Number(venda.valor_total) || 0,
    quantidade_vendida: Number(venda.quantidade_vendida) || 0,
  };

  return {
    isValid: errors.length === 0,
    errors,
    sanitized,
  };
}

/**
 * Valida dados de devolução
 */
export function validateDevolucao(devolucao: any): ValidationResult {
  const errors: string[] = [];

  if (!devolucao) {
    return { isValid: false, errors: ['Devolução é nula ou indefinida'] };
  }

  if (!devolucao.id) errors.push('ID da devolução está faltando');
  if (!devolucao.data_devolucao) errors.push('Data da devolução está faltando');
  if (typeof devolucao.valor_total !== 'number') errors.push('Valor total inválido');
  if (typeof devolucao.quantidade !== 'number') errors.push('Quantidade inválida');

  // Validar status
  const validStatuses = ['pendente', 'aprovada', 'rejeitada', 'arquivada'];
  if (!validStatuses.includes(devolucao.status)) {
    errors.push(`Status inválido: ${devolucao.status}`);
  }

  const sanitized = {
    ...devolucao,
    valor_total: Number(devolucao.valor_total) || 0,
    quantidade: Number(devolucao.quantidade) || 0,
  };

  return {
    isValid: errors.length === 0,
    errors,
    sanitized,
  };
}

/**
 * Valida array de dados
 */
export function validateArray<T>(
  data: any[],
  validator: (item: any) => ValidationResult
): { valid: T[]; invalid: any[] } {
  const valid: T[] = [];
  const invalid: any[] = [];

  data.forEach((item, index) => {
    const result = validator(item);
    if (result.isValid && result.sanitized) {
      valid.push(result.sanitized);
    } else {
      invalid.push({
        index,
        item,
        errors: result.errors,
      });
    }
  });

  // Log erros se houver
  if (invalid.length > 0) {
    console.warn(`⚠️ Dados inválidos encontrados:`, invalid);
  }

  return { valid, invalid };
}

/**
 * Valida dados monetários
 */
export function validateMoney(value: any): number {
  const num = Number(value);
  if (isNaN(num) || num < 0) {
    console.warn(`Valor monetário inválido: ${value}`);
    return 0;
  }
  return Math.round(num * 100) / 100; // Arredondar para 2 casas decimais
}

/**
 * Valida datas
 */
export function validateDate(date: any): Date | null {
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) {
      console.warn(`Data inválida: ${date}`);
      return null;
    }
    return d;
  } catch (error) {
    console.error(`Erro ao validar data: ${date}`, error);
    return null;
  }
}
