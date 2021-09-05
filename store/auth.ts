import AUTH_COOKIE_NAME from '~/enums/authCookieName'
const defaultCookieOptions = {
    path: '/',
    sameSite: 'lax',
    // secure: true, // TODO: Open this on production
}
import {LoginForm} from '@/types/auth'

export default {
    state: () => ({
        isLoading: false,
        isLoggedIn: false,
        username: '' as string
    }),

    mutations: {
        SET_LOADING(state: any, payload: boolean = false) {
            state.isLoading = payload
        },
        SET_USER(state: any, payload: string) {
            state.username = payload
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
            $cookies.set(
                AUTH_COOKIE_NAME.USERNAME,
                state.username,
                cookieOptions
            )
        },

        _removeAuthTokenFromCookie() {
            Object.values(AUTH_COOKIE_NAME).forEach((cookieName: string) => {
                const { $cookies }: any = this
                $cookies.remove(cookieName)
            })
        },

        async loadTokensFromCookie({ commit, dispatch }: any) {
            const { $cookies }: any = this
            const isLoggedIn = $cookies.get(AUTH_COOKIE_NAME.IS_LOGGED_IN)
            if (isLoggedIn) {
                commit('USER_LOGIN_SUCCESS')
                await dispatch('fetchUserData')
            } else {
                commit('USER_LOGIN_FAILED')
                await dispatch('_removeAuthTokenFromCookie')
            }
            
        },

        async login(
            { commit, dispatch }: any,
            { username, password }: LoginForm
        ) {
            try {
                commit('SET_LOADING', true)
                const { app }: any = this
                const response: any = await app.$services.auth.login({ username, password})
                

                if (!response){
                    throw new Error('Something bad happened')
                } else {
                    dispatch('exchangeToken', { username })
                }
            } catch (error) {
                commit('USER_LOGIN_FAILED')
                commit('SET_LOADING', false)

                throw error
            }
        },

        async exchangeToken(
            { commit, dispatch }: any,
            { username }: { username: string}
        ) {
            try {
                commit('SET_LOADING', true)

                commit('USER_LOGIN_SUCCESS')
                commit('SET_USER', username)
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
                
                window.location.reload()
            }
        },

        fetchUserData({ state, dispatch }: any) {
            return Promise.all([
                state.isLoggedIn
                    ? dispatch('me/fetchProfile', null, { root: true })
                    : null,
            ])
        },
    }
}
