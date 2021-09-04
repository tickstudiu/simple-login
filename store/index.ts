import AUTH_COOKIE_NAME from '~/enums/authCookieName'

export default {
    actions: {
        async nuxtServerInit({ dispatch }: any, { app, redirect }: any) {
            try {
                if (app.$cookies.get(AUTH_COOKIE_NAME.IS_LOGGED_IN)) {
                    await dispatch('auth/loadTokensFromCookie')
                }
            } catch {
                redirect({ name: 'Home' })
            }
        },
    },
}
