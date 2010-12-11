require.paths.unshift(__dirname + '/../node_modules');
require.paths.unshift(__dirname + '/../app');

var testCase = require('nodeunit').testCase;

var mockDb = {
  createCollection: function() { }
};
var Project = require('models/project').Project(mockDb);

var mockId = function(id) {
  return {
    toHexString: function() { return id; }
  }
};

module.exports = testCase({

  testKeyReturnsIdWhenSlugIsEmpty: function(test) {
    test.expect(1);

    var project = new Project({
      _id: mockId('id')
    });

    test.equal('id', project.key);

    test.done();
  },

  testKeyReturnsSlugWhenSlugIsNotempty: function(test) {
    test.expect(1);

    var project = new Project({
      _id: mockId('id'),
      slug: 'foo'
    });

    test.equal('foo', project.key);

    test.done();
  }

});
