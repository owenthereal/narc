var mongoose = require('mongoose').Mongoose;

mongoose.model('Project', {

  properties: [
    'name',
    'repository_url',
    'command',
    {
      builds: [[
        'created_at',
        'success',
        'stdout',
        'stderr'
      ]]
    }
  ],

  indexes: [
    'name'
  ],

  getters: {
    id: function() {
      return this._id.toHexString();
    }
  }

});

exports.Project = function(db) {
  return db.model('Project');
};
