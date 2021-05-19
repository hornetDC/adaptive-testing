// import * as functions from 'firebase-functions';

// exports.helloWorld = functions.https.onRequest((_request, response) => {
//   response.send('Hello from Firebase!');
// });

import { Server } from '@hapi/hapi';

let server: Server;

export const init = async function (): Promise<Server> {
  server = new Server({
    port: process.env.PORT || 4000,
    host: '0.0.0.0'
  });

  server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {
      return 'Hello World!';
    }
  });

  return server;
};

export const start = async function (): Promise<void> {
  console.log(`Listening on ${server.settings.host}:${server.settings.port}`);
  return server.start();
};

process.on('unhandledRejection', err => {
  console.error('unhandledRejection');
  console.error(err);
  process.exit(1);
});

init().then(() => start());
