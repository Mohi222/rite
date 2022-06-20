const path = require('path')

const info = {
  name: 'Template',
  version: '0.0.0',
  description: 'a template for Rite',
}

const prompts = [
  {
    name: 'init',
    type: 'confirm',
    message: 'Do you want to initialize a node project?',
  },
  {
    hide: (prompts) => !prompts.init,
    type: 'confirm',
    name: 'http-server',
    message: 'Do you want a http server?',
  },
  {
    name: 'meow',
    type: 'confirm',
    message: 'Do you like cats?',
  },
]

module.exports = {
  ...info,
  prompts,
  path: (prompts) => {
    if (prompts.init) {
      return '/files/node'
    } else {
      return '/files/static'
    }
  },
}
