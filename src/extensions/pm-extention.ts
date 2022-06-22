import { GluegunToolbox } from 'gluegun'
import findUp = require('find-up')
import ora = require('ora')
export interface PackageManager {
  run: () => Promise<void>
  install: () => Promise<void>
  add: () => Promise<void>
  addGlobally: () => Promise<void>
  addDev: () => Promise<void>
  remove: () => Promise<void>
  removeGlobally: () => Promise<void>
  removeDev: () => Promise<void>
  upgrade: () => Promise<void>
  upgradeInteractive: () => Promise<void>
  /* a wrapper over toolbox.child that handles the input and output */
  direct: ({
    args,
    options,
    callback,
    stdout,
    stderr,
    spinnerText,
  }: {
    args?: string[]
    options?: Record<string, string>
    callback?: (code: string) => void
    stdout?: (data: string, spinner: ora.Ora) => void
    stderr?: (err: string) => void
    spinnerText?: string
  }) => Promise<void>
  stdout: (data: string, spinner: ora.Ora) => void
  stderr: (err: string) => void
}

module.exports = (toolbox: GluegunToolbox) => {
  const PM_FILES = {
    pnpm: ['pnpm-lock.yaml'],
    yarn: ['yarn.lock'],
    npm: ['package-lock.json', 'npm-shrinkwrap.json'],
  }
  toolbox.pm = {
    getGlobalPackageManager: async (): Promise<PackageManager> => {
      const {
        config,
        prompt,
        filesystem: { writeAsync, resolve },
        print: { spin },
      } = toolbox
      const { globalPackageManager } = config
      const pm = globalPackageManager

      if (!globalPackageManager) {
        // Ask user to set global package manager
        const { pm } = await prompt.ask([
          {
            type: 'select',
            name: 'pm',
            message: 'What package manager do you want to use globally?',
            choices: ['pnpm', 'yarn', 'npm'],
          },
        ])
        const spinner = spin('Saving global package manager...')
        await writeAsync(resolve(process.cwd(), '.riterc'), {
          globalPackageManager: pm,
        })
        spinner.stop()
        return toolbox.pm[pm]
      }

      return toolbox.pm[pm]
    },
    getLocalPackageManager: async (): Promise<PackageManager> => {
      const packageJson = await findUp('package.json', {
        cwd: toolbox.filesystem.cwd(),
      })

      if (packageJson) {
        try {
          const data = JSON.parse(
            await toolbox.filesystem.readAsync(packageJson)
          )
          if (typeof data.pm === 'string' || data.packageManager === 'string') {
            const pmName = (data.pm || data.packageManager).split('@')[0]
            switch (pmName) {
              case 'pnpm':
                return toolbox.pm.pnpm
              case 'yarn':
                return toolbox.pm.yarn
              case 'npm':
                return toolbox.pm.npm
              default:
                throw new Error(`Unknown package manager: ${pmName}`)
            }
          }
        } catch (e) {
          toolbox.print.debug(e)
        }
      }

      const pmFile = await findUp([].concat(Object.values(PM_FILES)), {
        cwd: toolbox.filesystem.cwd(),
      })
      if (pmFile) {
        const pm = Object.keys(PM_FILES).find((pm) =>
          PM_FILES[pm].includes(pmFile)
        )
        return toolbox.pm[pm]
      }

      return toolbox.pm.pnpm
    },
    getPackageManager: async (global = false): Promise<PackageManager> => {
      const { parameters } = toolbox
      if (parameters.options.pnpm) return toolbox.pm.pnpm
      if (parameters.options.yarn) return toolbox.pm.yarn
      if (parameters.options.npm) return toolbox.pm.npm

      const {
        pm: { getLocalPackageManager, getGlobalPackageManager },
      } = toolbox
      if (global) return getGlobalPackageManager()

      return getLocalPackageManager() || getGlobalPackageManager()
    },
  }
}
