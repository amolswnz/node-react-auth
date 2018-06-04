// Main app setup
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const router = require('./router');

// Setup database
const mongoose = require('mongoose');
const dbHost = 'mongodb://localhost/',
  dbName = 'node-react';
mongoose.connect(dbHost + dbName);
const db = mongoose.connection;
db.on('error', console.error.bind(console, ' connection error'));
db.once('open', function callback() {
  console.log('--- MongoDB database connected at ' + dbHost);
  console.log('------- Database opened ' + dbName);
});

// App setup
app.use(morgan('combined'));
app.use(bodyParser.json({type: '*/*'}));
router(app);

// Server setup
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log('Server listening on http://localhost:' + port);
