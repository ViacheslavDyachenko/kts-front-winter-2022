const { alias } = require('react-app-rewire-alias');

module.exports = function override(config) {
  alias({
    '@root': 'src/root',
    '@store': 'src/store',
    '@shared': 'src/shared',
    '@components': 'src/components',
    '@pages': 'src/pages',
    '@styles': 'src/styles'
  })(config);

  return config;
};