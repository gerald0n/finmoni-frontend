import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import type { RootState } from '@/store'
import { initializeTheme, setTheme, toggleTheme } from '@/store'
import type { Theme } from '@/types'

export function useTheme() {
    const dispatch = useDispatch()
    const { theme, isDark } = useSelector((state: RootState) => state.theme)

    useEffect(() => {
        dispatch(initializeTheme())
    }, [dispatch])

    useEffect(() => {
        if (theme === 'system') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
            const handleChange = () => dispatch(setTheme('system'))

            mediaQuery.addEventListener('change', handleChange)
            return () => mediaQuery.removeEventListener('change', handleChange)
        }
        return undefined
    }, [theme, dispatch])

    const changeTheme = useCallback((newTheme: Theme) => {
        dispatch(setTheme(newTheme))
    }, [dispatch])

    const toggle = useCallback(() => {
        dispatch(toggleTheme())
    }, [dispatch])

    return {
        theme,
        isDark,
        setTheme: changeTheme,
        toggleTheme: toggle,
    }
}