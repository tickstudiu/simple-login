export default {
    state: () => ({
        profile: {},
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
                commit('FETCH_PROFILE_SUCCESS', {name: 'Username#001'})
            } catch (error) {
                commit('FETCH_PROFILE_ERROR', error)
            }
        },
    },
}
