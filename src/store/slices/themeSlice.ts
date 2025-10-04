import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import { STORAGE_KEYS } from '@/config/constants'
import type { Theme } from '@/types'

interface ThemeState {
    theme: Theme
    isDark: boolean
}

const getSystemTheme = (): boolean => {
    if (typeof window !== 'undefined') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return true
}

const getInitialTheme = (): Theme => {
    if (typeof window !== 'undefined') {
        const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) as Theme
        if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
            return savedTheme
        }
    }
    return 'dark'
}

const getIsDark = (theme: Theme): boolean => {
    switch (theme) {
        case 'dark':
            return true
        case 'light':
            return false
        case 'system':
            return getSystemTheme()
        default:
            return false
    }
}

const applyThemeToDOM = (isDark: boolean): void => {
    if (typeof window !== 'undefined') {
        const html = document.documentElement
        if (isDark) {
            html.classList.add('dark')
        } else {
            html.classList.remove('dark')
        }
    }
}

const initialTheme = getInitialTheme()
const initialIsDark = getIsDark(initialTheme)

// Aplicar tema imediatamente na inicialização
if (typeof window !== 'undefined') {
    applyThemeToDOM(initialIsDark)
}

const initialState: ThemeState = {
    theme: initialTheme,
    isDark: initialIsDark,
}

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        setTheme: (state, action: PayloadAction<Theme>) => {
            state.theme = action.payload
            state.isDark = getIsDark(action.payload)

            if (typeof window !== 'undefined') {
                localStorage.setItem(STORAGE_KEYS.THEME, action.payload)
                applyThemeToDOM(state.isDark)
            }
        },
        toggleTheme: (state) => {
            const newTheme: Theme = state.theme === 'light' ? 'dark' : 'light'
            state.theme = newTheme
            state.isDark = getIsDark(newTheme)

            if (typeof window !== 'undefined') {
                localStorage.setItem(STORAGE_KEYS.THEME, newTheme)
                applyThemeToDOM(state.isDark)
            }
        },
        initializeTheme: (state) => {
            if (typeof window !== 'undefined') {
                applyThemeToDOM(state.isDark)
            }
        },
    },
})

export const { setTheme, toggleTheme, initializeTheme } = themeSlice.actions
export default themeSlice.reducer