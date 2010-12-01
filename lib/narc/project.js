var Pattern = require('pattern');
var _ = require('underscore')._;
var ObjectID = require('mongodb/bson/bson').ObjectID;
var util = require('util');

exports.Project = function(db, callback) {

  var Project = Pattern.extend({

    initialize: function(attributes) {
      this._document = attributes;
      if (this._document === undefined || this._document === null) {
        this._document = {};
      }

      this.lastBuild = function() {
        return _.first(this.builds);
      };
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

    get name() {
      return this._document.name;
    },

    get repositoryUrl() {
      return this._document.repositoryUrl;
    },

    all: function(callback) {
      this._collection.find(function(err, cursor) {
        cursor.toArray(function(err, projects) {
          callback(err, _.map(projects, function(project) {
            return Project.new(project);
          }));
        });
      });
    },

    get: function(id, callback) {
      this._collection.findOne({ _id: ObjectID.createFromHexString(id) }, function(error, project) {
        callback(error, Project.new(project));
      });
    },

    isNewRecord: function() {
      return this._document._id === undefined || this._document._id === null;
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

  });

  db.createCollection('projects', function(err, collection) {
    db.collection('projects', function(err, collection) {
      Project._collection = collection;
    });
  });

  return Project;
}
