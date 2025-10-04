import { Outlet } from 'react-router-dom'

export function AuthLayout() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
            <div className="absolute inset-0 opacity-5"></div>
            <div className="relative">
                <Outlet />
            </div>
        </div>
    )
}