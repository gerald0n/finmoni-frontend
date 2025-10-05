import { configureStore } from '@reduxjs/toolkit'

import authReducer from './slices/authSlice'
import themeReducer from './slices/themeSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// Re-export actions para facilitar importação
export { login, logout, updateUser, setSelectedWorkspace, clearSelectedWorkspace, initializeAuth } from './slices/authSlice'
export { setTheme, toggleTheme, initializeTheme } from './slices/themeSlice'
