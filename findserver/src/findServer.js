'use strict';

const koa = require('koa');
const compose = require('koa-compose');
const logger = require('koa-logger');
const bodyParser = require('koa-bodyparser');
const router = require('koa-router');
const _ = require('lodash');


const env = {
  serverIP: process.env.SERVER_IP || '127.0.0.1:1400'
};

function* findServer() {
  return {
    "ip": env.serverIP
    // ,
    // "token":"aXpjR0txQFZMa3t2aGhlZn9vf1tyYH5gaGFjUEZvX1tAZX5jf2hwZX15fVF9endvbnxhUFM="
  };
}


function mkHandler(logic) {
  return function* () {
    this.set('Access-Control-Allow-Origin', '*');
    this.body = yield logic(this.request.body, this.request.query);
  };
}

const app = module.exports = koa();

const api = router();
api.post('/findServer', mkHandler(findServer));

const all = compose([
  logger(),
  bodyParser(),
  api.routes()
]);
app.use(all);

if (!module.parent) {
  app.listen(80);
}
