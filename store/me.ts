import AUTH_COOKIE_NAME from '~/enums/authCookieName'
import { Profile } from '@/types/me'
export default {
    state: () => ({
        profile: {} as Profile,
    }),

    mutations: {
        FETCH_PROFILE_SUCCESS(state: any, data: any) {
            state.profile = data
        },

        FETCH_PROFILE_ERROR(_: any, error: any) {
            console.error('Error while fetch profile: ', error)
        },
    },

    actions: {
        async fetchProfile({ commit }: any) {
            try {
                const { app, $cookies }: any = this
                const username = $cookies.get(AUTH_COOKIE_NAME.USERNAME)
                const response: Profile = await app.$services.me.profile({ username })
                commit('FETCH_PROFILE_SUCCESS', response)
            } catch (error) {
                commit('FETCH_PROFILE_ERROR', error)
            }
        },
    },
}
