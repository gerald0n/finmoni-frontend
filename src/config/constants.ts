export const API_CONFIG = {
    BASE_URL: 'http://localhost:3000',
    ENDPOINTS: {
        SIGN_IN: '/auth/sign-in',
        SIGN_UP: '/auth/sign-up',
    },
} as const

export const STORAGE_KEYS = {
    AUTH_TOKEN: 'auth_token',
    THEME: 'theme',
} as const

export const COOKIE_CONFIG = {
    EXPIRES_DAYS: 7,
    PATH: '/',
    SAME_SITE: 'strict' as const,
} as const