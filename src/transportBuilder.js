'use strict'

const { transports } = require('winston')
const fs = require('fs')

function build (configList = []) {
  const result = []
  if (configList.length === 0) {
    result.push(genConsoleTransport())
  } else {
    for (let i = 0; i < configList.length; i++) {
      const config = configList[i]
      switch (config.type) {
        case 'console':
          result.push(genConsoleTransport(config.level))
          break;
        case 'file':
          result.push(genFileTransport(config.level, config.filename))
          break;
        default:
        console.warn('no valid type configured for transport')
      }
    }
  }
  return result;
}

function genConsoleTransport (level = 'info') {
  return new transports.Console({level})
}

function genFileTransport (level = 'info', filename) {
  if (!fs.existsSync(filename)) {
    throw new Error(`${filename} is not valid`);
  }
  return new transports.File({
    level,
    filename
  })
}

module.exports = {
  build
}