exports.buildParser = function(build) {
  // console.log(build.stdout);
  var results = build.stdout.match(/(\d*) tests, (\d*) assertions, (\d*) failures, (\d*) errors(, (\d*) skips)?/);
  console.log(results);
  if (results)
  {
    return {
      created_at: build.created_at,
      success: build.success,
      stdout: build.stdout,
      stderr: build.stderr,
      tests: results[1],
      assertions: results[2],
      failures: results[3],
      errors: results[4],
      skips: results[6]
    };
  }
  else
    return {
      created_at: build.created_at,
      success: build.success,
      stdout: build.stdout,
      stderr: build.stderr
    };
};
