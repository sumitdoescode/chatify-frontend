export const SESSION_COOKIE_NAME = "chatify_logged_in";

const SESSION_COOKIE_VALUE = "true";
const SESSION_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

export function setFrontendSessionCookie() {
    document.cookie = `${SESSION_COOKIE_NAME}=${SESSION_COOKIE_VALUE}; Path=/; Max-Age=${SESSION_COOKIE_MAX_AGE}; SameSite=Lax`;
}

export function clearFrontendSessionCookie() {
    document.cookie = `${SESSION_COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax`;
}
