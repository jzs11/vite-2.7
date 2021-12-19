module.exports = {
  root: true,

  env: {
    node: true,
  },

  extends: ['plugin:vue/vue3-strongly-recommended', '@vue/airbnb', '@vue/typescript/recommended'],

  parserOptions: {
    ecmaVersion: 2021,
  },

  ignorePatterns: ['/node_modules/**'],

  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'linebreak-style': ['error', 'unix'],
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],
    'implicit-arrow-linebreak': 'off',
    'max-len': ['error', { code: 120 }],
    'no-unused-expressions': 'off',
    'no-param-reassign': 'off',
    'no-useless-constructor': 'off',
    'no-plusplus': 'off',
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'no-undef': 'off',
    'no-restricted-globals': 'off',
    'vuejs-accessibility/form-control-has-label': 'off',
    'vuejs-accessibility/label-has-for': 'off',
    'vuejs-accessibility/click-events-have-key-events': 'off',
    'class-methods-use-this': 'off',
  },

  overrides: [
    {
      files: ['**/__tests__/*.{j,t}s?(x)', '**/tests/unit/**/*.spec.{j,t}s?(x)'],
      env: {
        jest: true,
      },
    },
  ],
};
