import { GluegunCommand } from 'gluegun'

const command: GluegunCommand = {
  name: 'rite',
  run: async (toolbox) => {
    const { print, templates } = toolbox

    print.info(templates())
  },
}

module.exports = command
