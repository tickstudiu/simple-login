
/**
 * Enum for social auth provider
 * @readonly
 * @enum {String}
 */
export enum authCookieName {
    'ACCESS_TOKEN' = 'auth',
    'REFRESH_TOKEN' = 'refresh',
    'IS_LOGGED_IN' = 'isLoggedIn',
}

export default authCookieName
