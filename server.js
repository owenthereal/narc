var server = require('./app.js').server;
var util = require('util');

try {
  server.listen(8080);
} catch (ex) {
  console.log('Exception: %s', util.inspect(ex));
}

console.log('Express server starting on port %s', server.address().port);
