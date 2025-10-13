import { BarChart3, CreditCard, Target, TrendingUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { workspaceService } from '@/services/workspace'
import type { Workspace } from '@/types'

const dashboardCards = [
    {
        title: 'Contas Bancárias',
        description: 'Gerencie suas contas e acompanhe saldos',
        icon: CreditCard,
        href: '/bank-accounts',
        available: true
    },
    {
        title: 'Transações',
        description: 'Visualize e gerencie suas transações',
        icon: TrendingUp,
        href: '/transactions',
        available: false
    },
    {
        title: 'Relatórios',
        description: 'Relatórios financeiros detalhados',
        icon: BarChart3,
        href: '/reports',
        available: false
    },
    {
        title: 'Metas',
        description: 'Defina e acompanhe suas metas financeiras',
        icon: Target,
        href: '/goals',
        available: false
    }
]

export function DashboardPage() {
    const navigate = useNavigate()
    const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null)

    useEffect(() => {
        // Verificar se há workspace selecionado
        const workspace = workspaceService.getSelectedWorkspace()
        if (!workspace) {
            // Se não há workspace selecionado, redirecionar para seleção
            navigate('/workspace-selection', { replace: true })
            return
        }
        setCurrentWorkspace(workspace)
    }, [navigate])

    if (!currentWorkspace) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <h2 className="text-lg font-semibold mb-2">Carregando workspace...</h2>
                    <p className="text-muted-foreground">
                        Verificando workspace selecionado
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground">
                    {currentWorkspace.name}
                </h1>
                <p className="text-muted-foreground">
                    {currentWorkspace.description || 'Gerencie suas finanças de forma colaborativa'}
                </p>
            </div>

            {/* Visão geral das funcionalidades */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
                {dashboardCards.map((card) => {
                    const IconComponent = card.icon

                    if (card.available) {
                        return (
                            <Link key={card.href} to={card.href}>
                                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">
                                            {card.title}
                                        </CardTitle>
                                        <IconComponent className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription>
                                            {card.description}
                                        </CardDescription>
                                        <Button variant="ghost" size="sm" className="mt-3 p-0 h-auto font-medium">
                                            Acessar →
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Link>
                        )
                    }

                    return (
                        <Card key={card.href} className="h-full opacity-60">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {card.title}
                                </CardTitle>
                                <IconComponent className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <CardDescription>
                                    {card.description}
                                </CardDescription>
                                <p className="text-xs text-muted-foreground mt-3">
                                    Em breve
                                </p>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}
