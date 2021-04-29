const fs = require('fs');
const path = require('path');

const APP_PATH = fs.realpathSync(process.cwd());

function resolvePath(relativePath) {
  return path.resolve(APP_PATH, relativePath);
}

module.exports = {
  root: APP_PATH,
  src: resolvePath('src'),
  build: resolvePath('build'),
  assets: resolvePath('assets'),
  modules: resolvePath('node_modules')
};
