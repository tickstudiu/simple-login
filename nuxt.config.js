require('dotenv').config()

export default {
  server: {
    host: '0.0.0.0',
    port: 8080,
  },

  /**
   * Client-side env
   */
  env: {
    ENVIRONMENT: process.env.ENVIRONMENT,
    APP_BASE_URL: process.env.APP_BASE_URL,
    API_BASE_URL: process.env.API_BASE_URL,
  },

  // Disable the Progress Bar
  loading: false,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'simple-login',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['~/assets/css/tailwind', '~/assets/sass/style',],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/services.ts',
    '~/plugins/vuePlugins.ts',
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',

    '@nuxtjs/router',

    //https://www.npmjs.com/package/@nuxtjs/fontawesome
    '@nuxtjs/fontawesome'
  ],

  fontawesome: {
    component: 'fa',
    icons: {
      solid: true,
    }
  },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    // Doc: https://github.com/microcipcip/cookie-universal/tree/master/packages/cookie-universal-nuxt
    'cookie-universal-nuxt',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    baseURL: `${process.env.API_BASE_URL}`,
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en'
    }
  },

  render: {
    bundleRenderer: {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      shouldPreload: (file, type) => {
        return ['font'].includes(type)
      },
    },
  },
  
  baseUrl: process.env.APP_BASE_URL,

  // https://github.com/nuxt-community/router-module
  routerModule: {
    fileName: 'nuxt.router.js',
    keepDefaultRouter: true,
    parsePages: false,
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
