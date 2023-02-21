module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false,
  },
  extends: ['@nuxtjs', 'plugin:nuxt/recommended', 'prettier'],
  plugins: ['vue'],
  // add your custom rules here
  rules: {
    'import/namespace': 'off',
    'vue/attributes-order': 'off',
    'no-console': "off",
    'vue/first-attribute-linebreak': 'off'
  },
}
