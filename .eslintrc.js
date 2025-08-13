module.exports = {
  root: true,
  extends: '@react-native',
  rules: {
    semi: ['error', 'never'],
    'react-hooks/exhaustive-deps': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'no-sequences': ['error', {allowInParentheses: true}],
  },
}
