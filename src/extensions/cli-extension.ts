import { GluegunToolbox } from 'gluegun'

module.exports = (toolbox: GluegunToolbox) => {
  toolbox.templates = () => {
    const { resolve, subdirectories, cwd } = toolbox.filesystem
    const templatesPath = resolve(cwd(), 'templates')
    console.log(templatesPath)
    const templates = subdirectories(templatesPath)
    return templates
  }

  // enable this if you want to read configuration in from
  // the current folder's package.json (in a "rite" property),
  // rite.config.json, etc.
  toolbox.config = {
    ...toolbox.config,
    ...toolbox.config.loadConfig('rite', toolbox.filesystem.homedir()),
    ...toolbox.config.loadConfig('rite', process.cwd()),
  }
}
