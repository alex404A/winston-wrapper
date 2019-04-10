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
      if (val && val.constructor === RegExp) {
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

function buildFileInfo (message) {
  const s = (new Error()).stack
  const fileAndLine = traceCaller(1, s)
  if (!message) {
    return fileAndLine + ': ' + message
  } else {
    if (message instanceof Error) {
      message = errorMsg(message)
    } else {
      message = commonMsg(message)
    }
  }
  return fileAndLine + ': ' + message
}

function traceCaller (n, s) {
  if (isNaN(n) || n < 0) {
    n = 1
  }
  n += 1
  // let s = (new Error()).stack
  let a = s.indexOf('\n', 5)
  while (n--) {
    a = s.indexOf('\n', a + 1)
    if (a < 0) {
      a = s.lastIndexOf('\n', s.length)
      break
    }
  }
  let b = s.indexOf('\n', a + 1)
  if (b < 0) {
    b = s.length
  }
  a = Math.max(s.lastIndexOf(' ', b), s.lastIndexOf('/', b))
  b = s.lastIndexOf(':', b)
  s = s.substring(a + 1, b)
  return s
}


const defaultLabel = 'common'

class Factory {
  constructor (config = {}) {
    this.isFileInfoPrint = !!config.isFileInfoPrint
    this.buildFileInfo = buildFileInfo.bind(this)
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
    message = this.buildFileInfo(message)
    this.log('error', message, label)
  }
  
  warn (message, label = defaultLabel) {
    if (this.isFileInfoPrint) {
      message = this.buildFileInfo(message)
    }
    this.log('warn', message, label)
  }
  
  info (message, label = defaultLabel) {
    if (this.isFileInfoPrint) {
      message = this.buildFileInfo(message)
    }
    this.log('info', message, label)
  }
  
  verbose (message, label = defaultLabel) {
    if (this.isFileInfoPrint) {
      message = this.buildFileInfo(message)
    }
    this.log('verbose', message, label)
  }
  
  debug (message, label = defaultLabel) {
    if (this.isFileInfoPrint) {
      message = this.buildFileInfo(message)
    }
    this.log('debug', message, label)
  }
  
  silly (message, label = defaultLabel) {
    if (this.isFileInfoPrint) {
      message = this.buildFileInfo(message)
    }
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
