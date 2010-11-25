// exports.testSmoke = function(test) {
  // test.expect(1);
  // test.ok(true, 'this assertion should pass');
  // test.done();
// };

var assert = require('assert');

exports['test smoke'] = function() {
  assert.ok(true);
};
