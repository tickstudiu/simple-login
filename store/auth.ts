import AUTH_COOKIE_NAME from '~/enums/authCookieName'
const defaultCookieOptions = {
    path: '/',
    sameSite: 'lax',
    // secure: true, // TODO: Open this on production
}

export default {
    state: () => ({
        isLoading: false,
        isLoggedIn: false,
    }),

    mutations: {
        SET_LOADING(state: any, payload: boolean = false) {
            state.isLoading = payload
        },

        USER_LOGIN_SUCCESS(state: any) {
            state.isLoggedIn = true
        },

        USER_LOGIN_FAILED(state: any) {
            state.isLoggedIn = false
        },

        USER_LOGOUT_SUCCESS(state: any) {
            state.isLoggedIn = false
        },
    },

    actions: {
        _saveAuthStateToCookie({ state }: any, { maxAge }: { maxAge: number }) {
            const cookieOptions = {
                ...defaultCookieOptions,
                maxAge,
            }
            const { $cookies }: any = this            
            $cookies.set(
                AUTH_COOKIE_NAME.IS_LOGGED_IN,
                state.isLoggedIn,
                cookieOptions
            )
        },

        _removeAuthTokenFromCookie() {
            Object.values(AUTH_COOKIE_NAME).forEach((cookieName: string) => {
                const { $cookies }: any = this
                $cookies.remove(cookieName)
            })
        },

        async loadTokensFromCookie({ commit }: any) {
            const { $cookies }: any = this
            const isLoggedIn = $cookies.get(AUTH_COOKIE_NAME.IS_LOGGED_IN)
            if (isLoggedIn) commit('USER_LOGIN_SUCCESS')           
        },

        async login(
            { commit, dispatch }: any
        ) {
            try {
                commit('SET_LOADING', true)

                dispatch('exchangeToken')
            } catch (error) {
                commit('USER_LOGIN_FAILED')
                commit('SET_LOADING', false)

                throw error
            }
        },

        async exchangeToken(
            { commit, dispatch }: any,
        ) {
            try {
                commit('SET_LOADING', true)

                commit('USER_LOGIN_SUCCESS')
                dispatch('_saveAuthStateToCookie', {
                    maxAge: 31536000, // 1 year
                })

                window.location.reload()
            } catch (error) {
                commit('USER_LOGIN_FAILED')
                commit('SET_LOADING', false)
                throw error
            }
        },

        async logout({ commit, dispatch }: any) {
            commit('SET_LOADING', true)
            try {
                
            } finally {
                await dispatch('_removeAuthTokenFromCookie')
                commit('USER_LOGOUT_SUCCESS')
                commit('SET_LOADING', false)
            }
        },
    }
}
