/*
 * @Author: Gmsoft - WeiHong Ran
 * @Date: 2021-03-21 12:42:47
 * @LastEditors : Please set LastEditors
 * @LastEditTime: 2021-03-25 20:13:13
 * @Description: Nothing
 */
module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard',
    '@vue/typescript/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    // 关闭末尾强制删除分号
    semi: 'off',
    'comma-dangle': 'off',
    'space-before-function-paren': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    // 限制单文件最大行数350行，超过350行，请进行组件或模块拆分
    'max-lines': [
      'error',
      {
        max: 350,
        skipBlankLines: true,
        skipComments: true
      }
    ]
  },
};
