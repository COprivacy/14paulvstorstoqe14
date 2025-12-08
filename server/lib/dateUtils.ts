
/**
 * Utilitários de data configurados para o timezone de São Paulo (America/Sao_Paulo)
 * 
 * IMPORTANTE: Este módulo resolve o problema de datas sendo salvas um dia antes
 * devido à conversão UTC. Todas as funções consideram o timezone de São Paulo.
 */

const SAO_PAULO_TIMEZONE = 'America/Sao_Paulo';

/**
 * Retorna a data/hora atual no timezone de São Paulo
 */
export function getNowSaoPaulo(): Date {
  return new Date(new Date().toLocaleString('en-US', { timeZone: SAO_PAULO_TIMEZONE }));
}

/**
 * Formata uma data para ISO string no timezone de São Paulo
 * NOTA: Esta função ainda retorna uma string ISO que pode ter problemas de timezone
 * Use toDateStringSaoPaulo para armazenar apenas datas
 */
export function toISOStringSaoPaulo(date: Date = new Date()): string {
  const saoPauloDate = new Date(date.toLocaleString('en-US', { timeZone: SAO_PAULO_TIMEZONE }));
  return saoPauloDate.toISOString();
}

/**
 * Converte uma data para string ISO com hora ao meio-dia no timezone de São Paulo
 * Isso evita problemas de mudança de dia devido a conversões de timezone
 */
export function toDateStringSaoPauloNoon(date: Date = new Date()): string {
  const saoPauloDate = new Date(date.toLocaleString('en-US', { timeZone: SAO_PAULO_TIMEZONE }));
  saoPauloDate.setHours(12, 0, 0, 0);
  return saoPauloDate.toISOString();
}

/**
 * Converte uma data para string no formato YYYY-MM-DD no timezone de São Paulo
 * Use esta função para armazenar datas sem componente de hora
 */
export function toDateOnlyStringSaoPaulo(date: Date = new Date()): string {
  const year = date.toLocaleString('en-US', { timeZone: SAO_PAULO_TIMEZONE, year: 'numeric' });
  const month = date.toLocaleString('en-US', { timeZone: SAO_PAULO_TIMEZONE, month: '2-digit' });
  const day = date.toLocaleString('en-US', { timeZone: SAO_PAULO_TIMEZONE, day: '2-digit' });
  return `${year}-${month}-${day}`;
}

/**
 * Converte uma string de data (YYYY-MM-DD ou DD/MM/YYYY) para ISO string
 * com hora ao meio-dia para evitar problemas de timezone
 */
export function parseDateToISOSaoPaulo(dateString: string): string {
  let year: string, month: string, day: string;
  
  if (dateString.includes('/')) {
    // Formato brasileiro DD/MM/YYYY
    const parts = dateString.split('/');
    day = parts[0].padStart(2, '0');
    month = parts[1].padStart(2, '0');
    year = parts[2];
  } else if (dateString.includes('-')) {
    // Formato ISO YYYY-MM-DD ou YYYY-MM-DDTHH:mm:ss
    const datePart = dateString.split('T')[0];
    const parts = datePart.split('-');
    year = parts[0];
    month = parts[1].padStart(2, '0');
    day = parts[2].padStart(2, '0');
  } else {
    throw new Error(`Formato de data não reconhecido: ${dateString}`);
  }
  
  // Criar data ao meio-dia no timezone de São Paulo para evitar mudança de dia
  // São Paulo é UTC-3, então meio-dia em SP = 15:00 UTC
  const isoString = `${year}-${month}-${day}T15:00:00.000Z`;
  return isoString;
}

/**
 * Converte uma data ISO para o timezone de São Paulo
 */
export function fromISOToSaoPaulo(isoString: string): Date {
  const date = new Date(isoString);
  return new Date(date.toLocaleString('en-US', { timeZone: SAO_PAULO_TIMEZONE }));
}

/**
 * Formata uma data para exibição no formato brasileiro (DD/MM/YYYY HH:mm:ss)
 */
export function formatDateBR(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleString('pt-BR', {
    timeZone: SAO_PAULO_TIMEZONE,
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
    timeZone: SAO_PAULO_TIMEZONE,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

/**
 * Retorna início do dia no timezone de São Paulo (00:00:00)
 */
export function getStartOfDaySaoPaulo(date: Date = new Date()): Date {
  const saoPauloDate = new Date(date.toLocaleString('en-US', { timeZone: SAO_PAULO_TIMEZONE }));
  saoPauloDate.setHours(0, 0, 0, 0);
  return saoPauloDate;
}

/**
 * Retorna fim do dia no timezone de São Paulo (23:59:59)
 */
export function getEndOfDaySaoPaulo(date: Date = new Date()): Date {
  const saoPauloDate = new Date(date.toLocaleString('en-US', { timeZone: SAO_PAULO_TIMEZONE }));
  saoPauloDate.setHours(23, 59, 59, 999);
  return saoPauloDate;
}

/**
 * Adiciona dias a uma data mantendo o timezone de São Paulo
 * Retorna uma string ISO com hora ao meio-dia para evitar problemas de timezone
 */
export function addDaysSaoPaulo(date: Date, days: number): Date {
  const saoPauloDate = new Date(date.toLocaleString('en-US', { timeZone: SAO_PAULO_TIMEZONE }));
  saoPauloDate.setDate(saoPauloDate.getDate() + days);
  return saoPauloDate;
}

/**
 * Adiciona dias a uma data e retorna string ISO segura (ao meio-dia)
 * para evitar problemas de timezone ao armazenar
 */
export function addDaysAndGetISOSaoPaulo(date: Date, days: number): string {
  const saoPauloDate = new Date(date.toLocaleString('en-US', { timeZone: SAO_PAULO_TIMEZONE }));
  saoPauloDate.setDate(saoPauloDate.getDate() + days);
  saoPauloDate.setHours(12, 0, 0, 0);
  // Ajustar para UTC considerando que SP é UTC-3
  const utcDate = new Date(saoPauloDate.getTime() + (3 * 60 * 60 * 1000));
  return utcDate.toISOString();
}

/**
 * Verifica se duas datas são do mesmo dia no timezone de São Paulo
 */
export function isSameDaySaoPaulo(date1: Date, date2: Date): boolean {
  const d1 = formatDateOnlyBR(date1);
  const d2 = formatDateOnlyBR(date2);
  return d1 === d2;
}

/**
 * Retorna a data atual no timezone de São Paulo como string ISO
 * com hora ao meio-dia para evitar problemas de timezone
 */
export function getNowISOSaoPaulo(): string {
  const now = getNowSaoPaulo();
  now.setHours(12, 0, 0, 0);
  return now.toISOString();
}

/**
 * Calcula a diferença em dias entre duas datas no timezone de São Paulo
 */
export function getDaysDifferenceSaoPaulo(date1: Date | string, date2: Date | string): number {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
  
  // Converter para São Paulo e pegar apenas a data (sem hora)
  const sp1 = getStartOfDaySaoPaulo(d1);
  const sp2 = getStartOfDaySaoPaulo(d2);
  
  const diffTime = sp2.getTime() - sp1.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}
