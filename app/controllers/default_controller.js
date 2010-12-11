module.exports = function(app) {

  app.get('/', function(req, res) {
    Project.all(function(error, projects) {
      res.render('default/index', {
        locals: {
          projects: projects
        }
      });
    });
  });

};
