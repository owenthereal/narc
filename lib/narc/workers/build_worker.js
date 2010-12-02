var exec = require('child_process').exec,
    path = require('path'),
    util = require('util')
    ;

require.paths.unshift(path.join(__dirname + '/../../../node_modules'));
require.paths.unshift(path.join(__dirname + '/../../../lib'));

onmessage = function(message) {

  console.log('buildWorker => onmessage: %s', util.inspect(message));

  try {
    var src_dir = '/tmp/narc/' + message.data.projectId;
    var GitAdapter = require('narc/git_adapter');
    var gitAdapter = GitAdapter.new(message.data.repositoryUrl, message.data.branchName, src_dir + '/repo');
    var scm_cmd = 'mkdir -p ' + src_dir + ' && cd ' + src_dir + ' && rm -rf repo && mkdir repo';
    console.log(scm_cmd);
    var scm_process = exec(scm_cmd, function(error, stdout, stderr) {
      gitAdapter.setup(function(error) {
        var process = exec('cd ' + src_dir + '/repo && ' + message.data.buildCommand, function(error, stdout, stderr) {
          if (error !== null) {
            success = false;
          } else {
            success = true;
          }
          postMessage({
            stdout: stdout,
            stderr: stderr,
            success: success
          });
        });
      });
    });
  } catch(e) {
    console.log('Error: %s', util.inspect(e));
  }
};
