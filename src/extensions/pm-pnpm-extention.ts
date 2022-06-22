import { GluegunToolbox } from 'gluegun'
import { PackageManager } from './pm-extention'

module.exports = (toolbox: GluegunToolbox) => {
  const pnpm: PackageManager = {
    run: async () => {
      toolbox.pm.pnpm.direct({
        args: ['run'],
      })
    },

    install: async () => {
      toolbox.pm.pnpm.direct({
        spinnerText: 'Installing...',
        args: ['i'],
      })
    },

    add: async () => {
      toolbox.pm.pnpm.direct({
        spinnerText: 'Progress: resolved 0, reused 0, downloaded 0, added 0',
        args: ['add'],
      })
    },
    addGlobally: async () => {
      toolbox.pm.pnpm.direct({
        spinnerText: 'Progress: resolved 0, reused 0, downloaded 0, added 0',
        args: ['add', '-g'],
      })
    },
    addDev: async () => {
      toolbox.pm.pnpm.direct({
        spinnerText: 'Progress: resolved 0, reused 0, downloaded 0, added 0',
        args: ['add', '-d'],
      })
    },

    remove: async () => {
      toolbox.pm.pnpm.direct({
        args: ['rm'],
      })
    },
    removeGlobally: async () => {
      toolbox.pm.pnpm.direct({
        args: ['rm', '-g'],
      })
    },
    removeDev: async () => {
      toolbox.pm.pnpm.direct({
        args: ['rm', '-d'],
      })
    },

    upgrade: async () => {
      toolbox.pm.pnpm.direct({
        args: ['up'],
      })
    },
    upgradeInteractive: async () => {
      toolbox.pm.pnpm.direct({
        args: ['up', '-i'],
      })
    },

    direct: async ({
      args = [],
      options = {},
      callback = null,
      stdout = null,
      stderr = null,
      spinnerText = '',
    }) => {
      const {
        parameters,
        print,
        child,
        pm: { pnpm },
      } = toolbox
      const spinner = print.spin(spinnerText)

      const out = (data) => {
        return stdout ? stdout(data, spinner) : pnpm.stdout(data, spinner)
      }
      const err = stderr || pnpm.stderr
      const then =
        callback ||
        ((code) => {
          print.debug(code)
        })

      try {
        child.spawn(
          'pnpm',
          [...args, ...parameters.array],
          options,
          out,
          err,
          then
        )
      } catch (e) {
        print.error(e)
      }
    },

    stdout: (data, spinner) => {
      const { print } = toolbox

      const output: string = data.toString().trim()
      const lowered = output.toLowerCase()

      if (lowered.includes('progress')) {
        spinner.text = output
        return
      }

      spinner.stop()
      if (lowered.includes('done') || lowered.includes('already up-to-date')) {
        print.info(print.colors.green(output))
        return
      }

      if (lowered.includes('warn')) {
        print.warning(output)
        return
      }
      if (lowered.includes('err_pnpm')) {
        print.error(output)
        return
      }
      print.info(output)
    },
    stderr: (err) => {
      const { print } = toolbox
      print.error(err)
    },
  }

  toolbox.pm.pnpm = pnpm
}
