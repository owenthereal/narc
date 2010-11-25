var server = require('./app.js').server();

server.listen(8080);

console.log('Express server starting on port %s', server.address().port);
