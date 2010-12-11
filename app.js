require.paths.unshift(__dirname + '/node_modules');
require.paths.unshift(__dirname + '/app');

var fs = require('fs');

// Create the log directory (if it doesn't exist)
try {
  fs.statSync('log');
} catch (ex) {
  fs.mkdirSync('log', 0700);
}

// Setup application logger
// var log4js = require('log4js')();
// log4js.addAppender(log4js.fileAppender('log/app.log'), 'app');
// var logger = log4js.getLogger('app');
// logger.debug('hello world');

// Read configuration
try {
  var configJSON = fs.readFileSync(__dirname + '/config/app.json');
} catch(e) {
  console.log('File config/app.json not found. Try: `cp config/app.json.sample config/app.json`');
}
global.config = JSON.parse(configJSON.toString());

// Setup database connection
var mongo = require('mongodb');
var db = new mongo.Db('narc', new mongo.Server(global.config.mongo_host, global.config.mongo_port, {}), {});
db.open(function(connection) {
  Project = require('models/project').Project(db);
});

// Setup application server
var pub = __dirname + '/public';
var express = require('express');

function NotFound(msg) {
  this.name = 'NotFound';
  Error.call(this, msg);
  Error.captureStackTrace(this, arguments.callee);
}

var app = express.createServer(
  express.bodyDecoder(),
  express.methodOverride()
);

app.configure(function() {
  app.set('view engine', 'jade');
  app.set('views', __dirname + '/app/views');
  app.use(express.staticProvider(__dirname + '/public'));
  app.use(express.logger());
  app.use(express.logger({
    stream: fs.createWriteStream('log/request.log')
  }));
  app.use(express.favicon());

  app.use(express.errorHandler({
    dumpExceptions: true,
    showStack: true
  }));
});

app.error(function(err, req, res, next) {
  if (err instanceof NotFound) {
    res.render('404.ejs', {
      locals: { },
      status: 404,
      layout: false
    });
  } else {
    res.render('500.ejs', {
      locals: {
        error: err
      },
      status: 500,
      layout: false
    });
  }
});

require('helpers/path_helpers')(app);

require('controllers/default_controller.js')(app);
require('controllers/project_controller.js')(app);

app.get('/*', function(req, res) {
  throw new NotFound;
});

exports.server = app;
