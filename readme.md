# Rite

A CLI for starting new projects, the way you want.

# Features
- One tool for using the ri(g)ht package manager
- Configurable

# Installation

## Prerequisites
- NodeJS
- pnpm or yarn or npm

```bash
# install it globally
# npm
$ npm install --g rite

# yarn
$ yarn global add rite

# pnpm
$ pnpm add -g rite
```

# Commands
## `rite i / rite install / rite add `
```bash
# install all dependencies
rite i
# install lodash in project
rite i lodash
# install typescript as devDependency
rite id typescript
# install http-server globally
rite ig http-server
```

## `rite [cmd] / rite run [cmd]`
```bash
rite start
# npm run start

# if you have a script which
# name already exists in rite
rite run init

# pass arguments
rite dev --port=8000
# pnpm/npm run dev -- --port=3000
# yarn run dev --port=3000

# interactively select a script to run
rite r

# re run the last script
rite rr
```

## `rite u / rite upgrade`
```bash
rite u

# upgrade interactively
# for now only for pnpm and yarn
rite iu
```

## `rite d / rite remove / rite uninstall`
```bash
# remove lodash from project
rite d lodash
# remove typescript from devDependencies
rite dd typescript
# remove http-server globally
rite dg http-server
```

## `rite pm`
```bash
# an alias for project's package manager
# if rite couldn't find project package manager
# it uses the default package manager from
# global configuration
rite pm run test
# pnpm/yarn/npm run test
```