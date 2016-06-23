import bunyan from 'bunyan';

function createBunyanLogger(loggerName) {
  const loggerFileName = process.env.NODE_ENV ? `server_${process.env.NODE_ENV}.log` : 'server.log';
  return bunyan.createLogger({
    name: loggerName,
    streams: [{
      type: 'rotating-file',
      path: `./log/${loggerFileName}`,
      period: '1d',
      count: 7
    }]
  });
}

const LoggerWrapperStore = new Map();

function createLogger(loggerName = 'app') {
  let ret = LoggerWrapperStore[loggerName];
  if (ret === undefined || ret === null) {
    ret = createBunyanLogger(loggerName);
    LoggerWrapperStore.set(loggerName, ret);
  }
  return ret;
}

export {createLogger as default};
