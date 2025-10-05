import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type { User, Workspace } from '@/types'

interface AuthState {
    isAuthenticated: boolean
    user: User | null
    selectedWorkspace: Workspace | null
    isInitialized: boolean
}

const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
    selectedWorkspace: null,
    isInitialized: false,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<User>) => {
            state.isAuthenticated = true
            state.user = action.payload
            state.isInitialized = true
        },
        logout: (state) => {
            state.isAuthenticated = false
            state.user = null
            state.selectedWorkspace = null
            state.isInitialized = true
        },
        initializeAuth: (state, action: PayloadAction<{ user: User | null; workspace: Workspace | null }>) => {
            const { user, workspace } = action.payload
            state.isAuthenticated = !!user
            state.user = user
            state.selectedWorkspace = workspace
            state.isInitialized = true
        },
        updateUser: (state, action: PayloadAction<Partial<User>>) => {
            if (state.user) {
                state.user = { ...state.user, ...action.payload }
            }
        },
        setSelectedWorkspace: (state, action: PayloadAction<Workspace>) => {
            state.selectedWorkspace = action.payload
        },
        clearSelectedWorkspace: (state) => {
            state.selectedWorkspace = null
        },
    },
})

export const { login, logout, updateUser, setSelectedWorkspace, clearSelectedWorkspace, initializeAuth } = authSlice.actions
export default authSlice.reducer