
/**
 * Utilitários de data configurados para o timezone de São Paulo (America/Sao_Paulo)
 */

/**
 * Retorna a data/hora atual no timezone de São Paulo
 */
export function getNowSaoPaulo(): Date {
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
}

/**
 * Formata uma data para ISO string no timezone de São Paulo
 */
export function toISOStringSaoPaulo(date: Date = new Date()): string {
  const saoPauloDate = new Date(date.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
  return saoPauloDate.toISOString();
}

/**
 * Converte uma data ISO para o timezone de São Paulo
 */
export function fromISOToSaoPaulo(isoString: string): Date {
  const date = new Date(isoString);
  return new Date(date.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
}

/**
 * Formata uma data para exibição no formato brasileiro (DD/MM/YYYY HH:mm:ss)
 */
export function formatDateBR(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

/**
 * Formata uma data para exibição apenas data no formato brasileiro (DD/MM/YYYY)
 */
export function formatDateOnlyBR(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

/**
 * Retorna início do dia no timezone de São Paulo (00:00:00)
 */
export function getStartOfDaySaoPaulo(date: Date = new Date()): Date {
  const saoPauloDate = new Date(date.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
  saoPauloDate.setHours(0, 0, 0, 0);
  return saoPauloDate;
}

/**
 * Retorna fim do dia no timezone de São Paulo (23:59:59)
 */
export function getEndOfDaySaoPaulo(date: Date = new Date()): Date {
  const saoPauloDate = new Date(date.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
  saoPauloDate.setHours(23, 59, 59, 999);
  return saoPauloDate;
}

/**
 * Adiciona dias a uma data mantendo o timezone de São Paulo
 */
export function addDaysSaoPaulo(date: Date, days: number): Date {
  const saoPauloDate = new Date(date.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
  saoPauloDate.setDate(saoPauloDate.getDate() + days);
  return saoPauloDate;
}

/**
 * Verifica se duas datas são do mesmo dia no timezone de São Paulo
 */
export function isSameDaySaoPaulo(date1: Date, date2: Date): boolean {
  const d1 = formatDateOnlyBR(date1);
  const d2 = formatDateOnlyBR(date2);
  return d1 === d2;
}
