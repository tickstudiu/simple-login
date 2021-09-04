import qs from 'qs'
import { Plugin } from '@nuxt/types'

declare module 'vue/types/vue' {
    // this.$services inside Vue components
    interface Vue {
        $services: any
    }
}

declare module '@nuxt/types' {
    // nuxtContext.app.$services inside asyncData, fetch, plugins, middleware, nuxtServerInit
    interface NuxtAppOptions {
        $services: any
    }
    // nuxtContext.$services
    interface Context {
        $services: any
    }
}

declare module 'vuex/types/index' {
    // this.$services inside Vuex stores
    interface Store<S> {
        $services: any
    }
}

/**
 * Get files from ~/services/*.ts
 */
const requireService = require.context(
    // The relative path of the components folder
    '~/services',
    // Whether or not to look in subfolders
    false,
    // The regular expression used to match base component filenames
    /\.ts$/
)

/**
 * Automatically import everything in ~/services/*.ts
 * and inject the httpClient to use in all of them
 * The filename of service will act as service name
 * E.g. given service file `~/services/categories.ts`
 * The service will named `categories`
 *
 * @param {*} httpClient HTTP Client to use. E.g. Axios
 * @param {Object} [nuxtContext] Optional Nuxt's context, in case some service needed (https://nuxtjs.org/api/context/)
 * @returns {Object} Services object
 */
const createServices = (httpClient: any, nuxtContext: any) =>
    requireService.keys().reduce((obj: any, currentFilename: any) => {
        const serviceName = currentFilename
            .split('/')
            .pop()
            .replace(/\.\w+$/, '')
        return {
            ...obj,
            [serviceName]: requireService(currentFilename).default(
                httpClient,
                nuxtContext
            ),
        }
    }, {})

const services: Plugin = (context: any, inject: any) => {
    const { app, store, $axios } = context

    // Add the things needed for every request by Axios
    $axios.onRequest((config: any) => {
        // Set default paramsSerializer
        // Default array params as comma style
        config.paramsSerializer = (params: any) =>
            qs.stringify(params, { arrayFormat: 'comma' })

        // Set config if the baseURL have the /store prefix
        if (config.baseURL.includes(process.env.API_PATH_PREFIX)) {
            // Add param: lang to every requests
            config.params = config.params || {} // set default object first, if the request doesn't have any params
            config.params.lang = app.i18n.locale

            // Add Authentication: Bearer <access_token> to every requests
            // when create store auth
            const authState = store.state.auth
            if (authState.accessToken) {
                config.headers.Authorization = `Bearer ${authState.accessToken}`
            }
        }

        return config
    })

    let isLoggingOut = false
    // Catch every error, and if it's 401, refresh token and try again
    $axios.onResponseError(async (error: any) => {
        // Hack: Workaround to prevent infinite loop if refresh token throw 401
        if (error.config.url !== '/auth/token' && error.response.status === 401) {
            if (store.state.auth.isLoggedIn) {
                // User logged in, try refresh token
                const xReqRetry = error.config.headers['x-req-retry']
                if (xReqRetry >= 1) {
                    // If retry more than threshold, stop refreshToken and log user out
                    // since this request is failed because of another reason
                    await store.dispatch('auth/logout')
                } else {
                    // Try refreshing token
                    await store.dispatch('auth/refreshToken')
                    // Count how many times this request try to call the same fetch again
                    error.config.headers['x-req-retry'] = xReqRetry ? xReqRetry + 1 : 1
                    // And call the same fetch again
                    return $axios.request(error.config)
                }
            } else {
                // User not logged in,
                // this can be either guest token is expire or the token is invalid
                // Remove cookie so the app generate new guest

                // This check is neccessary so we not end up with force reload loop
                // in case of multiple APIs return 401
                if (isLoggingOut) {
                    return Promise.reject(error)
                }
                isLoggingOut = true
                await store.dispatch('auth/_removeAuthTokenFromCookie')
                // Bring user to home page
                window.location.href = '/'
            }
        }
        return Promise.reject(error)
    })

    // Auto import services and inject to Nuxt
    // The filename of service will act as service name
    // E.g. given service file `~/services/categories.ts`
    // The service can be use with `context.$services.categories.method()`
    inject('services', createServices($axios, context))
}

export default services
