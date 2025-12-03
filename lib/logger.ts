interface LogPayload {
  [key: string]: any
}

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

function baseLog(level: LogLevel, event: string, payload?: LogPayload) {
  const entry = {
    ts: new Date().toISOString(),
    level,
    event,
    ...payload,
  }
  // For now, output to console; can be replaced with external sink later.
  if (level === 'error') {
    console.error(JSON.stringify(entry))
  } else if (level === 'warn') {
    console.warn(JSON.stringify(entry))
  } else if (level === 'info') {
    console.info(JSON.stringify(entry))
  } else {
    // debug
    if (process.env.LOG_LEVEL === 'debug') {
      console.debug(JSON.stringify(entry))
    }
  }
}

export const logger = {
  debug: (event: string, payload?: LogPayload) => baseLog('debug', event, payload),
  info: (event: string, payload?: LogPayload) => baseLog('info', event, payload),
  warn: (event: string, payload?: LogPayload) => baseLog('warn', event, payload),
  error: (event: string, payload?: LogPayload) => baseLog('error', event, payload),
}

export default logger