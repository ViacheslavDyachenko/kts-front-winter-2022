const { alias } = require('react-app-rewire-alias');

module.exports = function override(config) {
  alias({
    '@root': 'src/root',
    '@store': 'src/store',
    '@shared': 'src/shared'
  })(config);

  return config;
};