import { LoginForm } from '@/types/auth'
import { User } from '@/types/user'
export default ($axios: any) => ({
    async login({ username, password }: LoginForm) {
        const users: Array<User> = await $axios.$get('/users')
        return users.find((user: User) => user.username === username && user.password === password)
    }
})