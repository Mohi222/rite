import { GluegunToolbox } from 'gluegun'
import { PackageManager } from './pm-extention'

module.exports = (toolbox: GluegunToolbox) => {
  const npm: PackageManager = {
    run: async () => {
      const { parameters } = toolbox
      if (parameters.array.length > 1) {
        parameters.array.unshift(parameters.array[0])
        parameters.array[1] = '--'
      }
      toolbox.pm.npm.direct({
        args: ['run'],
      })
    },

    install: async () => {
      toolbox.pm.npm.direct({
        args: ['install'],
      })
    },

    add: async () => {
      toolbox.pm.npm.direct({
        args: ['install'],
      })
    },
    addGlobally: async () => {
      toolbox.pm.npm.direct({
        args: ['install', '-g'],
      })
    },
    addDev: async () => {
      toolbox.pm.npm.direct({
        args: ['install', '-d'],
      })
    },

    remove: async () => {
      toolbox.pm.npm.direct({
        args: ['uninstall'],
      })
    },
    removeGlobally: async () => {
      toolbox.pm.npm.direct({
        args: ['uninstall', '-g'],
      })
    },
    removeDev: async () => {
      toolbox.pm.npm.direct({
        args: ['uninstall', '-d'],
      })
    },

    upgrade: async () => {
      toolbox.pm.npm.direct({
        args: ['update', '--save'],
      })
    },
    upgradeInteractive: async () => {
      toolbox.print.error('This command is not supported yet')
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
      print.debug(parameters)
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
          'npm',
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
      spinner.stop()
      print.info(data.toString().trim())
    },
    stderr: (err) => {
      const { print } = toolbox
      print.error(err)
    },
  }

  toolbox.pm.npm = npm
}
