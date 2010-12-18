_ = require('underscore')._
require('noid')
Document = require('noid/document').Document

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
    @findFirst { conditions: { slug: key } }, (error, project) ->
      if project?
        callback null, project
        return
      console.log('Falling back to id')
      @findFirst { conditions: { id: key } }, callback

exports.Project = Project
