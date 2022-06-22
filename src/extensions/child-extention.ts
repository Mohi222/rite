import * as spawn from 'cross-spawn'
import { GluegunToolbox } from 'gluegun'

module.exports = (toolbox: GluegunToolbox) => {
  toolbox.child = {
    spawn: (command, args, options, stdout, stderr, then) => {
      const spawned = spawn(command, args, options)
      if (spawned.stdout) spawned.stdout.on('data', stdout)
      spawned.on('exit', then)
      if (spawned.stderr) spawned.stderr.on('data', stderr)
      return spawned
    },
  }
}
