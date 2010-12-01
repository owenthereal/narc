var Pattern = require('pattern'),
    exec = require('child_process').exec;

var GitAdapter = module.exports = Pattern.extend({

  initialize: function(repositoryUrl, branch, workingDir) {
    this.repositoryUrl = repositoryUrl;
    this.workingDir = workingDir;
    this.branch = branch
  },

  setup: function(callback) {
    var cloneCmd = 'git clone -b ' + this.branch + ' ' + this.repositoryUrl + ' ' + this.workingDir;
    console.log(cloneCmd);
    exec(cloneCmd, function(error, stdout, stderr) {
      callback(error);
    });
  }

});
