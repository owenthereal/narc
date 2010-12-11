var exec = require('child_process').exec,
    path = require('path'),
    util = require('util'),
    spawn = require('child_process').spawn
    ;

require.paths.unshift(path.join(__dirname + '/../../node_modules'));
require.paths.unshift(path.join(__dirname + '/../../app'));

onmessage = function(message) {

  console.log('buildWorker => onmessage: %s', util.inspect(message));

  try {
    var src_dir = '/tmp/narc/' + message.data.projectId;
    var GitAdapter = require('git_adapter');
    var gitAdapter = new GitAdapter(message.data.repositoryUrl, message.data.branchName, src_dir + '/repo');
    var scm_cmd = 'mkdir -p ' + src_dir + ' && cd ' + src_dir + ' && rm -rf repo && mkdir repo';
    console.log(scm_cmd);
    var scm_process = exec(scm_cmd, function(error, stdout, stderr) {
      gitAdapter.setup(function(error) {
        
        var build_process = spawn("sh", ['-c','cd ' + src_dir + '/repo && ' + message.data.buildCommand], { cwd: src_dir + '/repo' });
        
        stdout = ""
        build_process.stdout.on("data", function(data){
          stdout += data;
          console.log('stdout: ' + data);
          postMessage({
            stdout: data.toString('ascii'),
            stderr: null,
            finished: false
          });
        });
        
        stderr = ""
        build_process.stderr.on('data', function(data){
          stderr += data;
          console.log('stderr: ' + data)
          postMessage({
            stdout: null,
            stderr: data.toString('ascii'),
            finished: false
          });
        })
        
        build_process.on('exit', function(code){
          console.log('exit code: ' + code)
          postMessage({
            stdout: stdout,
            stderr: stderr,
            success: parseInt(code) == 0,
            finished: true
          });
        })
      });
    });
  } catch(e) {
    console.log('Error: %s', util.inspect(e));
  }
};
