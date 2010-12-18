_ = require('underscore')._
require('noid')
Document = require('noid/document').Document
ObjectID = require('mongodb/bson/bson').ObjectID

class Project extends Document

  @storeIn 'projects'

  @field 'branchName'
  @field 'builds'
  @field 'buildCommand'
  @field 'name'
  @field 'notificationEmailAddress'
  @field 'repositoryUrl'
  @field 'slug'

  builds: ->
    @attributes.builds ?= []

  key: ->
    if @slug() then @slug() else @id()

  lastBuild: ->
    _.last(@builds())

  @find: (key, callback) ->
    self = this
    @findFirst { conditions: { slug: key } }, (error, project) ->
      if project?
        callback null, project
        return
      self.findFirst { conditions: { _id: ObjectID.createFromHexString(key) } }, callback

exports.Project = Project
