'use strict'

const winston = require('winston');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf, colorize } = format;

const myFormat = printf(info => {
  if (!info.timestamp) {
    return 'unknown'
  }
  const now = new Date(info.timestamp)
  const formatMsg = JSON.stringify(info.message, (name, val) => {
    if ( val && val.constructor === RegExp) {
      return val.toString();
    } else if ( val && val.constructor === Function) {
      return `[Function] ${name}`;
    } else {
      return val;
    }
  }, 2)
  return `${now.toLocaleDateString()} ${now.toLocaleTimeString()} ${info.level}: [${info.label}] ${formatMsg}`;
});

const defaultLabel = 'common'

class Factory {
  constructor (config = {}) {
    this.logger = createLogger(Object.assign({
      level: 'info',
      format: combine(
        colorize(),
        timestamp(),
        myFormat
      ),
      transports: [
        new transports.Console()
      ]
    }, config));
  }

  error (message, label = defaultLabel) {
    this.log('error', message, label)
  }
  
  warn (message, label = defaultLabel) {
    this.log('warn', message, label)
  }
  
  info (message, label = defaultLabel) {
    this.log('info', message, label)
  }
  
  verbose (message, label = defaultLabel) {
    this.log('verbose', message, label)
  }
  
  debug (message, label = defaultLabel) {
    this.log('debug', message, label)
  }
  
  silly (message, label = defaultLabel) {
    this.log('silly', message, label)
  }

  log (level, message, label) {
    this.logger.log({
      level,
      message,
      label
    })
  }

}

module.exports = {
  Factory
}
