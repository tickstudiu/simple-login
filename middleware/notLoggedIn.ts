/**
 * Redirect user to home page if they logged in
 */
export default ({ store, redirect }: any) => {
    if (store.state.auth.isLoggedIn) {
        redirect('/')
    }
}
