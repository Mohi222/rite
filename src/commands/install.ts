import { GluegunToolbox } from 'gluegun'

module.exports = {
  name: 'install',
  alias: ['i', 'id', 'ig'],
  run: async (toolbox: GluegunToolbox) => {
    const {
      parameters,
      pm: { getPackageManager },
    } = toolbox

    if (!parameters.first) {
      // run pm install
    }
    const isGlobal =
      parameters.argv[2] === 'ig' ||
      !!parameters.options.g ||
      !!parameters.options.global
    const isDev =
      parameters.argv[2] === 'id' ||
      !!parameters.options.d ||
      !!parameters.options.dev
    const pm = await getPackageManager(isGlobal)
    if (isGlobal) {
      await pm.addGlobally()
      return
    }

    if (isDev) {
      await pm.addDev()
      return
    }
    await pm.add()
  },
}
