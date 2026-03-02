// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  css: ['~/assets/css/main.scss'],

  devServer: {
    port: 4000,
    host: '0.0.0.0',
  },

  i18n: {
    defaultLocale: 'ru',
    locales: [{ code: 'ru', name: 'Russian', file: 'ru.json' }],
  },
  routeRules: {
    '/api/**': {
      proxy: 'http://digital_studio_server-app:3001/api/**',
    },
  },

  devtools: { enabled: true },
  modules: ['@nuxtjs/i18n'],
});
