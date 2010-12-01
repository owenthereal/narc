var inspect = require('sys').inspect;
var exec = require('child_process').exec;
var GitAdapter = require('narc/git_adapter.js');

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
      var build = {
        created_at: new Date(),
        success: null,
        stdout: '',
        stderr: ''
      };
      // TODO: Extract this junk out into something that can be tested and extensible.
      var src_dir = '/tmp/narc/' + project.id;
      var gitAdapter = GitAdapter.new(project.repositoryUrl, project.branchName, src_dir + '/repo');
      var scm_cmd = 'mkdir -p ' + src_dir + ' && cd ' + src_dir + ' && rm -rf repo && mkdir repo';
      console.log(scm_cmd);
      var scm_process = exec(scm_cmd, function(error, stdout, stderr) {
        gitAdapter.setup(function(error) {
          var process = exec('cd ' + src_dir + '/repo && ' + project.buildCommand, function(error, stdout, stderr) {
            build.stdout = stdout;
            build.stderr = stderr;
            if (error !== null) {
              build.success = false;
            } else {
              build.success = true;
            }
            if (!project.builds) {
              project.builds = [];
            }
            project.builds.push(build);
            project.save(function(error) {
              res.render('projects/build', {
                locals: {
                  project: project,
                  build: build
                }
              });
            });
          });
        });
      });
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
