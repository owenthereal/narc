var Pattern = require('pattern'),
    exec = require('child_process').exec;

var GitAdapter = module.exports = Pattern.extend({

  initialize: function(repositoryUrl, workingDir) {
    this.repositoryUrl = repositoryUrl;
    this.workingDir = workingDir;
  },

  setup: function(callback) {
    var cloneCmd = 'git clone ' + this.repositoryUrl + ' ' + this.workingDir;
    console.log(cloneCmd);
    exec(cloneCmd, function(error, stdout, stderr) {
      callback(error);
    });
  }

});
