exports.buildParser = function(build) {
  stdout = build.stdout
  return {
    created_at: build.created_at,
    success: build.success,
    stdout: build.stdout,
    stderr: build.stderr,
    tests: (tests = stdout.match(/[\s,](\d*) tests/i)) ? tests[1] : null,
    assertions: (assertions = stdout.match(/[\s,](\d*) assertions/i)) ? assertions[1] : null,
    failures: (failures = stdout.match(/[\s,](\d*) failures/i)) ? failures[1] : null,
    errors: (errors = stdout.match(/[\s,](\d*) errors/i)) ? errors[1] : null,
    skips: (skips = stdout.match(/[\s,](\d*) skips/i)) ? skips[1] : null
  };
};