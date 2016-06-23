import bunyan from 'bunyan';

const Package = require('../../package.json');

function createBunyanLogger(loggerName, level = 'info', toConsole = false) {
  const loggerFileName = process.env.NODE_ENV ?
    `${loggerName}_${process.env.NODE_ENV}.log` : '${loggerName}.log';
  const streams = [{
    type: 'rotating-file',
    path: `./log/${loggerFileName}`,
    period: '1d',
    count: 7,
    level
  }];
  if (toConsole) {
    streams.push({stream: process.stdout, level});
  }
  return bunyan.createLogger({
    name: loggerName,
    streams
  });
}

const LoggerWrapperStore = new Map();

function createLogger() {
  const loggerName = 'server';
  let ret = LoggerWrapperStore[loggerName];
  if (ret === undefined || ret === null) {
    let level = Package.customInformation.default.log.level;
    let toConsole = Package.customInformation.default.log.toConsole;
    if (process.env.NODE_ENV) {
      level = Package.customInformation[process.env.NODE_ENV].log.level;
      toConsole = Package.customInformation[process.env.NODE_ENV].log.toConsole;
    }
    /* eslint-disable no-console */
    console.log('Logger level is: %s', level);
    /* eslint-enable no-console */
    ret = createBunyanLogger(loggerName, level, toConsole);
    LoggerWrapperStore.set(loggerName, ret);
  }
  return ret;
}

export {createLogger as default};
