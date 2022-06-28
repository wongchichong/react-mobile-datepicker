const path = require('path');

module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    'airbnb-typescript',
  ],
  plugins: [
    'import',
    'react',
    '@typescript-eslint'
  ],
  rules: {
    'no-underscore-dangle': ['error', { allow: ['_id'] }],
    'import/prefer-default-export': 'off',
    'import/first': 'error',
    'import/order': ['error', {
      groups: [
          ['builtin', 'external'], 'internal', 'parent', 'sibling', 'index'
      ],
      'newlines-between': 'always',
      alphabetize: {
        order: 'asc',
        caseInsensitive: true
      }
    }],
    'import/no-relative-parent-imports': 'error',
    '@typescript-eslint/no-unused-vars': ['error', {
      varsIgnorePattern: '_',
      argsIgnorePattern: '_',
    }],
    'sort-imports': ['error', {
      ignoreCase: true,
      ignoreDeclarationSort: true,
      ignoreMemberSort: false,
    }],
    'quotes': ['error', 'single', {
      'allowTemplateLiterals': true,
      'avoidEscape': true,
    }],
    'jsx-quotes': ['error', 'prefer-single'],
    'object-curly-newline': ['error', {
      'ObjectExpression': { multiline: true },
      'ObjectPattern': { multiline: true },
      'ImportDeclaration': { multiline: true, minProperties: 4 },
      'ExportDeclaration': { multiline: true, minProperties: 4 }
    }],
    '@typescript-eslint/type-annotation-spacing': 'error',
    '@typescript-eslint/switch-exhaustiveness-check': 'error',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    project: [path.resolve(__dirname, './tsconfig.json')],
    tsconfigRootDir: __dirname,
    ecmaFeatures: {
      "jsx": true
    }
  },
};
