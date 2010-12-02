var inspect = require('sys').inspect;
var util = require('util');

var Worker = require('webworker').Worker;

module.exports = function(app) {

  app.get('/projects', function(req, res) {
    Project.all(function(error, projects) {
      res.render('projects/index', {
        locals: {
          projects: projects
        }
      });
    });
  });

  app.get('/projects/new', function(req, res) {
    res.render('projects/new', {
      locals: {
        project: {}
      }
    });
  });

  app.get('/projects/:id', function(req, res) {
    Project.get(req.params.id, function(error, project) {
      res.render('projects/show', {
        locals: {
          project: project
        }
      });
    });
  });

  app.get('/projects/:id/build', function(req, res) {
    Project.get(req.params.id, function(error, project) {
      var buildWorker = new Worker(__dirname + '/../lib/narc/workers/build_worker.js');
      buildWorker.onmessage = function(message) {
        // console.log('%s', util.inspect(message));
        buildWorker.terminate();

        var build = {
          created_at: new Date(),
          success: message.data.success,
          stdout: message.data.stdout,
          stderr: message.data.stderr
        };
        if (!project.builds) {
          project.builds = [];
        }
        project.builds.push(build);
        project.save(function(error) {
          // done
        });
      };
      console.log('Talking to the build worker...');
      buildWorker.postMessage({
        projectId: project.id,
        repositoryUrl: project.repositoryUrl,
        buildCommand: project.buildCommand,
        branchName: project.branchName,
      });
      var build = {
        created_at: new Date(),
        success: null,
        stdout: '',
        stderr: ''
      };
      res.redirect('/projects/' + project.key);
    });
  });

  app.get('/projects/:id/edit', function(req, res) {
    Project.get(req.params.id, function(error, project) {
      res.render('projects/edit', {
        locals: {
          project: project
        }
      });
    });
  });

  app.get('/projects/:id/delete', function(req, res) {
    Project.get(req.params.id, function(error, project) {
      res.render('projects/delete', {
        locals: {
          project: project
        }
      });
    });
  });

  app.post('/projects', function(req, res) {
    var project = Project.new(req.body['project']);
    project.save(function(error) {
      res.redirect('/projects/' + project.id);
    });
  });

  app.put('/projects/:id', function(req, res) {
    Project.get(req.params.id, function(error, project) {
      project.updateAttributes(req.body['project']);
      project.save(function(error) {
        res.redirect('/projects/' + req.params.id);
      });
    });
  });

  app.del('/projects/:id', function(req, res) {
    Project.get(req.params.id, function(error, project) {
      project.destroy(function() {
        res.redirect('/projects');
      });
    });
  });

}
