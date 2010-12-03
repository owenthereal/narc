{exec, spawn} = require 'child_process'

print = (data) -> console.log data.toString().trim()

task 'test', 'Test the app', (options) ->
  nodeunit = spawn './bin/nodeunit', ['test']
  nodeunit.stdout.on 'data', print
  nodeunit.stderr.on 'data', print
