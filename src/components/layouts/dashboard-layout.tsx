import { Outlet } from 'react-router-dom'

import { DashboardHeader } from './dashboard-header'
import { DashboardSidebar } from './dashboard-sidebar'

export function DashboardLayout() {
    return (
        <div className="h-screen bg-background flex flex-col overflow-hidden">
            {/* Header fixo no topo */}
            <DashboardHeader />

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar lateral */}
                <DashboardSidebar />

                {/* Conteúdo principal */}
                <main className="flex-1 overflow-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}