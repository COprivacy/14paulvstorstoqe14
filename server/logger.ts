import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export enum LogLevel {
  ERROR = 'ERROR',
  WARN = 'WARN',
  INFO = 'INFO',
  DEBUG = 'DEBUG'
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: string;
  data?: any;
  userId?: string;
  requestId?: string;
}

// Métricas de telemetria para sistema de bloqueios
interface LockingMetrics {
  aprovacoes_total: number;
  aprovacoes_com_erro: number;
  tempo_medio_aprovacao_ms: number;
  bloqueios_ativos: number;
  produtos_com_bloqueios: Set<number>;
  ultimas_latencias: number[];
}

const lockingMetrics: LockingMetrics = {
  aprovacoes_total: 0,
  aprovacoes_com_erro: 0,
  tempo_medio_aprovacao_ms: 0,
  bloqueios_ativos: 0,
  produtos_com_bloqueios: new Set(),
  ultimas_latencias: [],
};

class Logger {
  private logsDir: string;
  private currentLogFile: string;
  private maxLogSize = 10 * 1024 * 1024; // 10MB
  private logLevel: LogLevel;

  constructor() {
    this.logsDir = path.join(__dirname, 'logs');
    this.ensureLogsDirectory();
    this.currentLogFile = this.getLogFileName();
    this.logLevel = (process.env.LOG_LEVEL as LogLevel) || LogLevel.INFO;
  }

  private ensureLogsDirectory() {
    if (!fs.existsSync(this.logsDir)) {
      fs.mkdirSync(this.logsDir, { recursive: true });
    }
  }

  private getLogFileName(): string {
    const date = new Date().toISOString().split('T')[0];
    return path.join(this.logsDir, `app-${date}.log`);
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.ERROR, LogLevel.WARN, LogLevel.INFO, LogLevel.DEBUG];
    return levels.indexOf(level) <= levels.indexOf(this.logLevel);
  }

  private rotateLogIfNeeded() {
    const newLogFile = this.getLogFileName();
    if (newLogFile !== this.currentLogFile) {
      this.currentLogFile = newLogFile;
    }

    if (fs.existsSync(this.currentLogFile)) {
      const stats = fs.statSync(this.currentLogFile);
      if (stats.size > this.maxLogSize) {
        const timestamp = new Date().getTime();
        const rotatedFile = this.currentLogFile.replace('.log', `-${timestamp}.log`);
        fs.renameSync(this.currentLogFile, rotatedFile);
      }
    }
  }

  private getTimestampSaoPaulo(): string {
    return new Date().toLocaleString('sv-SE', { 
      timeZone: 'America/Sao_Paulo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3
    }).replace(' ', 'T') + 'Z';
  }

  private writeLog(entry: LogEntry) {
    if (!this.shouldLog(entry.level)) return;

    this.rotateLogIfNeeded();
    const logLine = JSON.stringify(entry) + '\n';

    fs.appendFileSync(this.currentLogFile, logLine, 'utf-8');

    // Também exibe no console em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      const consoleMsg = `[${entry.timestamp}] ${entry.level} ${entry.context ? `[${entry.context}]` : ''} ${entry.message}`;
      console.log(consoleMsg, entry.data || '');
    }
  }

  error(message: string, context?: string, data?: any, userId?: string) {
    this.writeLog({
      timestamp: this.getTimestampSaoPaulo(),
      level: LogLevel.ERROR,
      message,
      context,
      data,
      userId
    });
  }

  warn(message: string, context?: string, data?: any, userId?: string) {
    this.writeLog({
      timestamp: this.getTimestampSaoPaulo(),
      level: LogLevel.WARN,
      message,
      context,
      data,
      userId
    });
  }

  info(message: string, context?: string, data?: any, userId?: string) {
    this.writeLog({
      timestamp: this.getTimestampSaoPaulo(),
      level: LogLevel.INFO,
      message,
      context,
      data,
      userId
    });
  }

  debug(message: string, context?: string, data?: any, userId?: string) {
    this.writeLog({
      timestamp: this.getTimestampSaoPaulo(),
      level: LogLevel.DEBUG,
      message,
      context,
      data,
      userId
    });
  }

  // Método para buscar logs (útil para admin)
  async getLogs(date?: string, level?: LogLevel, limit: number = 100): Promise<LogEntry[]> {
    const logFile = date
      ? path.join(this.logsDir, `app-${date}.log`)
      : this.currentLogFile;

    if (!fs.existsSync(logFile)) {
      return [];
    }

    const content = fs.readFileSync(logFile, 'utf-8');
    const lines = content.split('\n').filter(line => line.trim());

    let logs = lines
      .map(line => {
        try {
          return JSON.parse(line) as LogEntry;
        } catch {
          return null;
        }
      })
      .filter((log): log is LogEntry => log !== null);

    if (level) {
      logs = logs.filter(log => log.level === level);
    }

    return logs.slice(-limit);
  }

  // Limpar logs antigos (manter últimos 30 dias)
  async cleanOldLogs(daysToKeep: number = 30) {
    const files = fs.readdirSync(this.logsDir);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    for (const file of files) {
      if (!file.startsWith('app-') || !file.endsWith('.log')) continue;

      const filePath = path.join(this.logsDir, file);
      const stats = fs.statSync(filePath);

      if (stats.mtime < cutoffDate) {
        fs.unlinkSync(filePath);
        this.info('Log antigo removido', 'CLEANUP', { file });
      }
    }
  }

  // Telemetria específica para sistema de bloqueios
  trackAprovacao(latencia_ms: number, sucesso: boolean, produtosAfetados: number[]) {
    lockingMetrics.aprovacoes_total++;
    if (!sucesso) {
      lockingMetrics.aprovacoes_com_erro++;
    }

    lockingMetrics.ultimas_latencias.push(latencia_ms);
    if (lockingMetrics.ultimas_latencias.length > 100) {
      lockingMetrics.ultimas_latencias.shift();
    }

    const soma = lockingMetrics.ultimas_latencias.reduce((a, b) => a + b, 0);
    lockingMetrics.tempo_medio_aprovacao_ms = soma / lockingMetrics.ultimas_latencias.length;

    produtosAfetados.forEach(id => lockingMetrics.produtos_com_bloqueios.add(id));

    this.info(`Aprovação de orçamento ${sucesso ? 'concluída' : 'falhou'}`, 'LOCKING_TELEMETRY', {
      latencia_ms,
      produtos_afetados: produtosAfetados.length,
      taxa_erro: ((lockingMetrics.aprovacoes_com_erro / lockingMetrics.aprovacoes_total) * 100).toFixed(2) + '%',
      latencia_media_ms: lockingMetrics.tempo_medio_aprovacao_ms.toFixed(2),
    });
  }

  trackBloqueio(acao: 'criado' | 'removido', produtoId: number, quantidade: number) {
    if (acao === 'criado') {
      lockingMetrics.bloqueios_ativos++;
      lockingMetrics.produtos_com_bloqueios.add(produtoId);
    } else {
      lockingMetrics.bloqueios_ativos--;
    }

    this.info(`Bloqueio ${acao}`, 'LOCKING_TELEMETRY', {
      produto_id: produtoId,
      quantidade,
      bloqueios_ativos_total: lockingMetrics.bloqueios_ativos,
      produtos_unicos_bloqueados: lockingMetrics.produtos_com_bloqueios.size,
    });
  }

  getLockingMetrics() {
    return {
      ...lockingMetrics,
      produtos_com_bloqueios: lockingMetrics.produtos_com_bloqueios.size,
    };
  }

  resetLockingMetrics() {
    lockingMetrics.aprovacoes_total = 0;
    lockingMetrics.aprovacoes_com_erro = 0;
    lockingMetrics.tempo_medio_aprovacao_ms = 0;
    lockingMetrics.bloqueios_ativos = 0;
    lockingMetrics.produtos_com_bloqueios.clear();
    lockingMetrics.ultimas_latencias = [];
  }
}

export const logger = new Logger();