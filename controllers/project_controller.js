var inspect = require('sys').inspect;
var exec = require('child_process').exec;

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
      project.builds = [];
      build = {
        created_at: new Date(),
        success: null,
        stdout: '',
        stderr: ''
      };
      var process = exec(project.command, function(error, stdout, stderr) {
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
