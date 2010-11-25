require.paths.unshift('./node_modules');

var express = require('express'),
    util = require('util'),
    exec = require('child_process').exec,
    sass = require('sass'),
    mongoose = require('mongoose').Mongoose
    ;

var db = mongoose.connect('mongodb://localhost/narc');

Project = require('./models/project.js').Project(db);

var pub = __dirname + '/public';

var app = express.createServer(
  express.compiler({
    src: pub,
    enable: ['sass']
  }),
  express.bodyDecoder(),
  express.methodOverride()
);

app.set('view engine', 'jade');

app.configure(function() {
  app.use(express.methodOverride());
  app.use(express.bodyDecoder());
  // app.use(app.router());
  app.use(express.staticProvider(__dirname + '/public'));

  app.use(express.errorHandler({
    dumpExceptions: true,
    showStack: true
  }));
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

require(__dirname + '/controllers/default_controller.js')(app);
require(__dirname + '/controllers/project_controller.js')(app);

exports.server = function() {
  return app;
};

// app.listen(8080);
// console.log('Express server starting on port %s', app.address().port);
