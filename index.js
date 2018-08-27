'use strict'

const { createLogger, format } = require('winston');
const { combine, timestamp, label, printf, colorize } = format;
const transportBuilder = require('./src/transportBuilder')

const myFormat = printf(info => {
  const now = new Date(info.timestamp)
  let formatMsg
  if (info.message instanceof Error) {
    formatMsg = errorMsg(info.message)
  } else {
    formatMsg = commonMsg(info.message)
  }
  return `${now.toLocaleDateString()} ${now.toLocaleTimeString()} ${info.level}: [${info.label}] ${formatMsg}`;
});

function commonMsg (msg) {
  if (typeof msg === 'string') {
    return msg
  } else {
    return JSON.stringify(msg, (name, val) => {
      if ( val && val.constructor === RegExp) {
        return val.toString();
      } else if ( val && val.constructor === Function) {
        return `[Function] ${name}`;
      } else {
        return val;
      }
    }, 2)
  }
}

function errorMsg (err) {
  return `\nError message: ${err.message}\nError code: ${err.code}\nError stack: ${err.stack}`
}

const defaultLabel = 'common'

class Factory {
  constructor (config = {}) {
    this.logger = createLogger({
      level: 'info',
      format: combine(
        colorize(),
        timestamp(),
        myFormat
      ),
      transports: transportBuilder.build(config.transports)
    });
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
