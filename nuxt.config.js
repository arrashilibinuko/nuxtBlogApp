export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'BlogWebApp',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css2?family=Open+Sans:wght@300&display=swap',
      },
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['~assets/styles/main.css'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: ['~plugins/core-components.js', '~plugins/date-filter.js'],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    baseURL:
      process.env.BASE_URL ||
      'https://nuxtjsblog-a0487-default-rtdb.firebaseio.com',
    credentials: false,
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},

  env: {
    baseUrl:
      process.env.BASE_URL ||
      'https://nuxtjsblog-a0487-default-rtdb.firebaseio.com',
    fbAPIKey: 'AIzaSyDK3C1ADR-5Q1DiakpRzF09KAv8n0xipCM',
  },
  transition: {
    name: 'fade',
    mode: 'out-in',
  },

  router: {
    middleware: 'log',
  },
}
