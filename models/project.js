var Mongoose = require('mongoose').Mongoose;

Mongoose.model('Project', {

  properties: [
    'name',
    'repository_url',
    'command',
    'branch',
    'slug',
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
  },

  methods: {

    lastBuild: function() {
      return this.builds[this.builds.length - 1]
    }

  }

});

exports.Project = function(db) {
  return db.model('Project');
};
