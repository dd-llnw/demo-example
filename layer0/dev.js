const { build } = require('esbuild')
const { createDevServer } = require('@layer0/core/dev')

module.exports = function () {
  const appDir = process.cwd()
  build({
    entryPoints: [`${appDir}/sw/service-worker.js`],
    outfile: `${appDir}/dist/service-worker.js`,
    minify: true,
    bundle: true,
    define: {
      'process.env.NODE_ENV': '"production"',
      'process.env.LAYER0_PREFETCH_HEADER_VALUE': '"1"',
      'process.env.LAYER0_PREFETCH_CACHE_NAME': '"prefetch"',
    },
  })
  return createDevServer({
    label: 'Create React App',
    command: (port) => `PORT=${port} npm run start`,
    ready: [/localhost:/i],
    filterOutput: (line) => !(line.includes('localhost') || line.includes('127.0.0.1')),
  })
}
