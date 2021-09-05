/* eslint-disable no-console */
'user strict'

const express = require('@feathersjs/express')
const logger = require('./logger');
const config = require('config')
const app = require('./app');
const port = config.port;
const package = require('../package.json');

const apps = express();
apps.use('/api/v1', app);
app.use('/', (req,res)=>{
  return res.json({
    description: package.description,
    version: package.version
  })
})


const server = apps.listen(port);
app.setup(server)

process.on('unhandledRejection', (reason, p) =>
  logger.error('Unhandled Rejection at: Promise ', p, reason)
);

server.on('listening', () =>
  logger.info('Feathers application started on http://%s:%d', app.get('host'), port)
);
