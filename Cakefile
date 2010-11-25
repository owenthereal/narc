{exec, spawn} = require 'child_process'

print = (data) -> console.log data.toString().trim()

task 'test', 'Test the app', (options) ->
  expresso = spawn 'expresso', ['test']
  expresso.stdout.on 'data', print
  expresso.stderr.on 'data', print
