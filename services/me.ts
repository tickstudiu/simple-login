import { Profile } from '@/types/me'
export default ($axios: any) => ({
    async profile({ username }: {username: string}) {
        const profiles: Array<Profile> = await $axios.$get('/me')
        return profiles.find((profile: Profile) => profile.username === username)
    }
}) 