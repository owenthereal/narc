module.exports = function(app) {

  app.get('/', function(req, res) {
    Project.find().all(function(projects) {
      res.render('default/index', {
        locals: {
          projects: projects
        }
      });
    });
  });

};
