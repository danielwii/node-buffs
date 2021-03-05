module.exports = {
  extends: [
    'alloy',
    'alloy/typescript',
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
  ],
  env: {
    node: true,
    browser: false,
    jest: true,
    es6: true,
  },
  rules: {
    'import/no-cycle': ['error'],
    'max-params': 'off',
    // Use function hoisting to improve code readability
    '@typescript-eslint/no-parameter-properties': 'off',
    '@typescript-eslint/member-ordering': 'off',
  },
};
