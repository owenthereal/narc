require.paths.unshift(__dirname + '/node_modules');
require.paths.unshift(__dirname + '/lib');

var express = require('express');
var assetManager = require('connect-assetmanager');
var assetHandler = require('connect-assetmanager-handlers');
var sass = require('sass');

var fs = require('fs');
var mongo = require('mongodb');

try {
  var configJSON = fs.readFileSync(__dirname + '/config/app.json');
} catch(e) {
  console.log('File config/app.json not found. Try: `cp config/app.json.sample config/app.json`');
}
var config = JSON.parse(configJSON.toString());

var db = new mongo.Db('narc', new mongo.Server(config.mongo_host, config.mongo_port, {}), {});
db.open(function(connection) {
  Project = require('narc/project').Project(db);
});

var pub = __dirname + '/public';

var sass_compile = function(file, path, index, isLast, callback) {
  if (path.match(/\.sass$/)) {
    callback(sass.render(file));
  } else {
    callback(file);
  }
};

var assets = assetManager({
  css: {
    route: /\/static\/css\/[0-9]+\/.*\.css/,
    path: './public/css/',
    dataType: 'css',
    files: [
      'styles.sass'
    ],
    preManipulate: {
      'msie [6-7]': [
        sass_compile,
        assetHandler.fixVendorPrefixes,
        assetHandler.fixGradients,
        assetHandler.stripDataUrlsPrefix
      ],
      '^': [
        sass_compile,
        assetHandler.fixVendorPrefixes,
        assetHandler.fixGradients,
        assetHandler.replaceImageRefToBase64(__dirname + '/public')
      ]
    },
    postManipulate: {
      '^': [
        assetHandler.yuiCssOptimize, function(file, path, index, isLast, callback) {
          callback(file);
          // dummyTimestamps.css = Date.now();
        }
      ]
    }
  }
});

var app = express.createServer(
  express.bodyDecoder(),
  express.methodOverride()
);

app.set('view engine', 'jade');

app.dynamicHelpers({
  cacheTimestamps: function(req, res) {
    return assets.cacheTimestamps;
  }
});

app.configure(function() {
  app.use(express.methodOverride());
  app.use(express.bodyDecoder());
  // app.use(app.router());
  app.use(express.staticProvider(__dirname + '/public'));

  app.use(express.errorHandler({
    dumpExceptions: true,
    showStack: true
  }));
  app.use(assets);
});

/*
app.configure('development', function() {
  app.use(express.errorHandler({
    dumpExceptions: true,
    showStack: true
  }));
});

app.configure('production', function() {
  app.use(express.errorHandler());
});
*/

require('narc/helpers/path_helpers')(app);

require(__dirname + '/controllers/default_controller.js')(app);
require(__dirname + '/controllers/project_controller.js')(app);

exports.server = function() {
  return app;
};

// app.listen(8080);
// console.log('Express server starting on port %s', app.address().port);
