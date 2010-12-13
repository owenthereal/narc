module.exports = function(app) {

  app.helpers({

    home_path: function() {
      return '/';
    },

    /* Project path helpers */

    build_project_path: function(project) {
      return '/projects/' + project.key() + '/build';
    },

    delete_project_path: function(project) {
      return '/projects/' + project.key() + '/delete';
    },

    edit_project_path: function(project) {
      return '/projects/' + project.key() + '/edit';
    },

    new_project_path: function(project) {
      return '/projects/new';
    },

    project_path: function(project) {
      return '/projects/' + project.key();
    },

    projects_path: function() {
      return '/projects';
    }

  });

};
