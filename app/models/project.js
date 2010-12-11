var util = require('util');
var _ = require('underscore')._;
var ObjectID = require('mongodb/bson/bson').ObjectID;

exports.Project = function(db, callback) {

  var Project = function(attributes) {
    this._document = attributes || {};
  };

  Project.prototype = {

    get _collection() {
      return Project._collection;
    },

    get branchName() {
      return this._document.branchName;
    },

    get buildCommand() {
      return this._document.buildCommand;
    },

    get builds() {
      if (this._document.builds === undefined || this._document.builds === null) {
        this._document.builds = [];
      }
      return this._document.builds;
    },

    get id() {
      if (this.isNewRecord()) {
        return null;
      } else {
        return this._document._id.toHexString();
      }
    },

    get key() {
      return this.slug || this.id;
    },

    get name() {
      return this._document.name;
    },

    get notificationEmailAddress() {
      return this._document.notificationEmailAddress;
    },

    get repositoryUrl() {
      return this._document.repositoryUrl;
    },

    get slug() {
      return this._document.slug;
    },

    destroy: function(callback) {
      this._collection.remove({ _id: this._document._id }, callback);
    },

    isNewRecord: function() {
      return this._document._id === undefined || this._document._id === null;
    },

    lastBuild: function() {
      return _.last(this.builds);
    },

    save: function(callback) {
      if (this.isNewRecord()) {
        this._collection.insert([this._document], callback);
      } else {
        this._collection.update({ _id: this._document._id }, this._document, callback);
      }
    },

    updateAttributes: function(attributes) {
      for (var attribute in attributes) {
        this._document[attribute] = attributes[attribute];
      }
    }

  };

  Project.all = function(callback) {
    this._collection.find(function(err, cursor) {
      cursor.toArray(function(err, projects) {
        callback(err, _.map(projects, function(project) {
          return new Project(project);
        }));
      });
    });
  };

  Project.get = function(key, callback) {
    var self = this;
    self._collection.findOne({ 'slug': key }, function(error, project) {
      if (project === undefined || project === null) {
        self._collection.findOne({ '_id': ObjectID.createFromHexString(key) }, function(error, project) {
          callback(error, new Project(project));
        });
      } else {
        callback(error, new Project(project));
      }
    });
  };

  db.createCollection('projects', function(error, collection) {
    db.collection('projects', function(error, collection) {
      if (error !== undefined && error !== null) {
        console.log('Error: %s', util.inspect(error));
      }
      Project._collection = collection;
    });
  });

  return Project;

};
