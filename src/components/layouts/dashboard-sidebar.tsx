import { CreditCard, Home, Settings } from 'lucide-react'
import { NavLink } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const sidebarItems = [
    {
        title: 'Dashboard',
        icon: Home,
        href: '/dashboard',
        description: 'Página principal'
    },
    {
        title: 'Contas Bancárias',
        icon: CreditCard,
        href: '/bank-accounts',
        description: 'Gerencie suas contas'
    },
    {
        title: 'Cartões de Crédito',
        icon: CreditCard,
        href: '/credit-cards',
        description: 'Gerencie seus cartões'
    },
]

export function DashboardSidebar() {
    return (
        <aside className="w-64 border-r bg-muted/30 flex flex-col overflow-hidden">
            <div className="flex flex-col h-full">
                {/* Informações do sistema - fixas no topo */}
                <div className="p-4 pb-0 shrink-0">
                    <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                        SISTEMA
                    </h3>
                    <p className="text-xs text-muted-foreground">
                        Versão 1.0.0
                    </p>
                </div>

                {/* Navegação principal - área com scroll */}
                <div className="flex-1 overflow-auto p-4 pt-6">
                    <nav className="space-y-2">
                        <h4 className="text-sm font-semibold text-muted-foreground mb-3">
                            NAVEGAÇÃO
                        </h4>

                        {sidebarItems.map((item) => (
                            <NavLink
                                key={item.href}
                                to={item.href}
                                className={({ isActive }) =>
                                    cn(
                                        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                                        'hover:bg-accent hover:text-accent-foreground',
                                        isActive
                                            ? 'bg-accent text-accent-foreground font-medium'
                                            : 'text-muted-foreground'
                                    )
                                }
                            >
                                <item.icon className="h-4 w-4" />
                                <div className="flex-1">
                                    <div>{item.title}</div>
                                    <div className="text-xs text-muted-foreground">
                                        {item.description}
                                    </div>
                                </div>
                            </NavLink>
                        ))}
                    </nav>
                </div>

                {/* Seção inferior - fixa na parte de baixo */}
                <div className="p-4 pt-0 shrink-0 border-t">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start gap-3 text-muted-foreground"
                        disabled
                        title="Em desenvolvimento"
                    >
                        <Settings className="h-4 w-4" />
                        Configurações
                    </Button>
                </div>
            </div>
        </aside>
    )
}
