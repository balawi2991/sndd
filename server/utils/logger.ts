// Simple logger utility
// For production, consider using Winston or Pino

interface LogData {
  message: string;
  level: 'info' | 'warn' | 'error';
  timestamp: Date;
  context?: any;
}

class Logger {
  private logs: LogData[] = [];
  private maxLogs = 1000; // Keep last 1000 logs in memory

  private formatMessage(level: string, message: string, context?: any): string {
    const timestamp = new Date().toISOString();
    const emoji = {
      info: 'ℹ️',
      warn: '⚠️',
      error: '❌',
    }[level] || '';

    let formatted = `${emoji} [${timestamp}] ${level.toUpperCase()}: ${message}`;
    
    if (context) {
      formatted += `\n${JSON.stringify(context, null, 2)}`;
    }

    return formatted;
  }

  private addLog(level: 'info' | 'warn' | 'error', message: string, context?: any) {
    const log: LogData = {
      message,
      level,
      timestamp: new Date(),
      context,
    };

    this.logs.push(log);

    // Keep only last maxLogs
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
  }

  info(message: string, context?: any) {
    console.log(this.formatMessage('info', message, context));
    this.addLog('info', message, context);
  }

  warn(message: string, context?: any) {
    console.warn(this.formatMessage('warn', message, context));
    this.addLog('warn', message, context);
  }

  error(message: string, error?: any) {
    const context = error instanceof Error
      ? {
          name: error.name,
          message: error.message,
          stack: error.stack,
        }
      : error;

    console.error(this.formatMessage('error', message, context));
    this.addLog('error', message, context);
  }

  getLogs(level?: 'info' | 'warn' | 'error', limit = 100): LogData[] {
    let filtered = this.logs;

    if (level) {
      filtered = filtered.filter((log) => log.level === level);
    }

    return filtered.slice(-limit);
  }

  clearLogs() {
    this.logs = [];
  }
}

export const logger = new Logger();
