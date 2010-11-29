var inspect = require('sys').inspect;
var exec = require('child_process').exec;
var GitAdapter = require('../lib/git_adapter.js');

module.exports = function(app) {

  app.get('/projects', function(req, res) {
    Project.find().all(function(projects) {
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
        project: new Project()
      }
    });
  });

  app.get('/projects/:id', function(req, res) {
    Project.findById(req.params.id, function(project) {
      res.render('projects/show', {
        locals: {
          project: project
        }
      });
    });
  });

  app.get('/projects/:id/build', function(req, res) {
    Project.findById(req.params.id, function(project) {
      // project.builds = [];
      build = {
        created_at: new Date(),
        success: null,
        stdout: '',
        stderr: ''
      };
      // TODO: Extract this junk out into something that can be tested and extensible.
      var src_dir = '/tmp/narc/' + project.id;
      var gitAdapter = GitAdapter.new(project.repository_url, src_dir + '/repo');
      var scm_cmd = 'mkdir -p ' + src_dir + ' && cd ' + src_dir + ' && rm -rf repo && mkdir repo';
      console.log(scm_cmd);
      var scm_process = exec(scm_cmd, function(error, stdout, stderr) {
        gitAdapter.setup(function(error) {
          var process = exec('cd ' + src_dir + '/repo && ' + project.command, function(error, stdout, stderr) {
            build.stdout = stdout;
            build.stderr = stderr;
            if (error !== null) {
              build.success = false;
            } else {
              build.success = true;
            }
            project.builds.push(build);
            project.save(function() {
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
    Project.findById(req.params.id, function(project) {
      res.render('projects/edit', {
        locals: {
          project: project
        }
      });
    });
  });

  app.get('/projects/:id/delete', function(req, res) {
    Project.findById(req.params.id, function(project) {
      res.render('projects/delete', {
        locals: {
          project: project
        }
      });
    });
  });

  app.post('/projects', function(req, res) {
    var project = new Project();
    project.name = req.body['project[name]'];
    project.save(function() {
      res.redirect('/projects/' + project.id);
    });
  });

  app.put('/projects/:id', function(req, res) {
    Project.findById(req.params.id, function(project) {
      project.name = req.body['project[name]'];
      project.repository_url = req.body['project[repository_url]'];
      project.command = req.body['project[command]'];
      project.save(function() {
        res.redirect('/projects/' + project.id);
      });
    });
  });

  app.del('/projects/:id', function(req, res) {
    Project.findById(req.params.id, function(project) {
      project.remove(function() {
        res.redirect('/projects');
      });
    });
  });

}
