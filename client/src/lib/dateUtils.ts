/**
 * Todas as funções utilizam o timezone de São Paulo (America/Sao_Paulo)
 */

export function getDaysUntilExpiry(vencimento: string | null): number | null {
  if (!vencimento) return null;
  
  const today = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
  const expiryDate = new Date(new Date(vencimento).toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
  const diffTime = expiryDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

export function getExpiryStatus(vencimento: string | null): 'expired' | 'critical' | 'warning' | 'ok' | null {
  const days = getDaysUntilExpiry(vencimento);
  
  if (days === null) return null;
  if (days < 0) return 'expired';
  if (days <= 7) return 'critical';
  if (days <= 30) return 'warning';
  return 'ok';
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  const dateStr = date.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });
  const timeStr = date.toLocaleTimeString('pt-BR', { 
    timeZone: 'America/Sao_Paulo',
    hour: '2-digit', 
    minute: '2-digit' 
  });
  return `${dateStr} ${timeStr}`;
}

export function getNowSaoPaulo(): Date {
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
}

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

export function formatDateOnlyBR(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}
