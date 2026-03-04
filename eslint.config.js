// eslint.config.js
import pluginVue from 'eslint-plugin-vue';
import pluginImport from 'eslint-plugin-import';
import pluginPrettier from 'eslint-plugin-prettier';
import configPrettier from 'eslint-config-prettier';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';

export default [
  // Базовые настройки
  {
    files: ['**/*.{js,ts,vue}'],
    ignores: ['node_modules/**', '.nuxt/**', 'dist/**', '.output/**'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
        extraFileExtensions: ['.vue'],
      },
      globals: {
        // Nuxt 4 глобальные переменные
        defineNuxtConfig: 'readonly',
        defineNuxtPlugin: 'readonly',
        useNuxtApp: 'readonly',
        useState: 'readonly',
        useFetch: 'readonly',
        useAsyncData: 'readonly',
        useRouter: 'readonly',
        useRoute: 'readonly',
        navigateTo: 'readonly',
        definePageMeta: 'readonly',
      },
    },
    plugins: {
      vue: pluginVue,
      '@typescript-eslint': tsPlugin,
      import: pluginImport,
      prettier: pluginPrettier, // Добавляем плагин Prettier
    },
    rules: {
      // Основные правила
      'comma-dangle': ['error', 'always-multiline'],
      semi: ['error', 'always'],
      'space-before-function-paren': [
        'error',
        {
          anonymous: 'never',
          named: 'never',
          asyncArrow: 'always',
        },
      ],
      camelcase: 'off',
      'generator-star-spacing': 'off',
      'arrow-parens': 'off',
      'one-var': 'off',
      'no-void': 'off',
      'multiline-ternary': 'off',
      'vue/max-attributes-per-line': 'off',
      'vue/multi-word-component-names': [
        'error',
        {
          ignores: ['index'], // имена, которые игнорировать
        },
      ],
      quotes: [
        'error',
        'single',
        {
          avoidEscape: true,
          allowTemplateLiterals: true,
        },
      ],

      // Import правила
      'import/first': 'off',
      'import/named': 'error',
      'import/namespace': 'error',
      'import/default': 'error',
      'import/export': 'error',
      'import/extensions': 'off',
      'import/no-unresolved': 'off',
      'import/no-extraneous-dependencies': 'off',

      // Дополнительные правила
      'prefer-promise-reject-errors': 'off',

      // Полезные правила для Nuxt
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],

      // Prettier - отключаем конфликтующие правила ESLint
      ...configPrettier.rules,

      // Запускаем Prettier как правило ESLint
      'prettier/prettier': ['error'],
    },
  },
  // Добавляем Vue рекомендации
  ...pluginVue.configs['flat/recommended'],
];
