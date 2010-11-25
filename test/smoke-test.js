var assert = require('assert');

var app = require('../app.js').server();

module.exports = {

  // 'test smoke': function() {
    // assert.ok(true);
  // },

  'test response': function() {
    assert.response(app, {
      url: '/',
      method: 'GET',
      timeout: 500
    }, {
      status: 200
    });
  },

};
