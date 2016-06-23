import Hapi from 'hapi';
import HapiSwagger from 'hapi-swagger';
import Inert from 'inert';
import Vision from 'vision';

import createLogger from './utils/createLogger';
import routers from './routers';

const Package = require('../package.json');

const log = createLogger();

class BaseApp {
  constructor(host, port, name) {
    this.name_ = name | Package.name;
    this.server_ = this.createServer_(host, port);
  }

  start() {
    this.setRequestResponseLog_();
    this.registerPluginsInServer_();
    this.addRoutes_();
    this.registerShutdownHandler_();
    this.startServer_();
  }

  createServer_(host, port) {
    const ret = new Hapi.Server();
    ret.connection({host, port});
    return ret;
  }

  setRequestResponseLog_() {
    let requestEventAF;
    this.server_.on('request-internal', requestEventAF = (request, event, tags) => {
      const path = request.url.path;
      if (tags.received && !path.startsWith('/swagger')) {
        log.debug({category: 'access'}, '%s:%s --> %s',
          request.info.remoteAddress, request.method.toUpperCase(), path);
      }
    });
    let responseEventAF;
    this.server_.on('response', responseEventAF = (request) => {
      const path = request.url.path;
      if (!path.startsWith('/swagger')) {
        log.debug({category: 'access'}, '%s:%s <-- %s [%s]',
          request.info.remoteAddress, request.method.toUpperCase(), path,
          request.response.statusCode);
      }
    });
  }

  registerPluginsInServer_() {
    const options = {
      info: {
        title: 'Test API Documentation',
        version: Package.customInformation.apiVersion
      },
      documentationPath: '/api/doc',
      basePath: '/api',
    };

    this.server_.register([
      Inert,
      Vision,
      {
        register: HapiSwagger,
        options
      }], (err) => {
      if (err) {
        log.error('Failed to register plugins due to: ', err);
        throw err;
      }
    });
  }

  addRoutes_() {
    this.server_.route(routers);
  }

  registerShutdownHandler_() {
    const exitProcessAfterFunc = (func) => {
      func();
      setTimeout(() => process.exit(), 0);
    };

    const shutdown = () => {
      log.info({category: 'appLifeCycle'}, 'Start to shutdown server %s', this.server_.info.uri);
      this.server_.stop({timeout: 5000},
        () => (
          exitProcessAfterFunc(() => (
            log.info({category: 'appLifeCycle'}, 'Server %s is shutdown', this.server_.info.uri))
          )
        )
      );
      const closeTimeOut = 10 * 1000; // 10 seconds
      setTimeout(
        () => (
          exitProcessAfterFunc(() => (
            log.info({category: 'appLifeCycle'}, 'Force to shutdown server %s',
              this.server_.info.uri))
          )
        ), closeTimeOut
      );
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  }

  startServer_() {
    let serverStartedAF;
    this.server_.start(serverStartedAF = (err) => {
      if (err) {
        log.error('Failed to start server due to:', err);
        throw err;
      }
      /* eslint-disable no-console */
      console.log('>>> Server is started.  You could access %s/api/doc for documentation.',
        this.server_.info.uri);
      /* eslint-enable no-console */

      log.info({category: 'appLifeCycle'}, 'Server %s is started', this.server_.info.uri);
    });
  }
}

export {BaseApp as default};

