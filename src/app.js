import BaseApp from './baseApp';

function main() {
  const host = process.env.CLOUD_CENTER_HOST || 'localhost';
  const port = process.env.CLOUD_CENTER_PORT || 3000;
  new BaseApp(host, port).start();
}

main();

