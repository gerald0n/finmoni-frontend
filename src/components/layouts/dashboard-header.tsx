import { ChevronDown, LogOut, Settings, UserPlus, Users } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { InviteMemberModal } from '@/components/invite-member-modal'
import { ThemeSelector } from '@/components/theme-selector'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useLogout } from '@/hooks/use-auth'
import type { RootState } from '@/store'

export function DashboardHeader() {
    const navigate = useNavigate()
    const logout = useLogout()
    const user = useSelector((state: RootState) => state.auth.user)
    const selectedWorkspace = useSelector((state: RootState) => state.auth.selectedWorkspace)

    const getUserInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
    }

    const handleChangeWorkspace = () => {
        navigate('/workspace-selection')
    }

    const handleWorkspaceSettings = () => {
        // Funcionalidade será implementada em versão futura
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center justify-between px-6">
                {/* Logo e nome do workspace */}
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <h1 className="text-xl font-bold text-primary">FinMoni</h1>
                        <div className="h-4 w-px bg-border" />
                        <span className="text-sm text-muted-foreground">
                            {selectedWorkspace?.name || 'Workspace'}
                        </span>
                    </div>
                </div>

                {/* Ações do workspace e usuário */}
                <div className="flex items-center space-x-4">
                    {/* Dropdown do workspace */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="gap-2">
                                <Users className="h-4 w-4" />
                                Workspace
                                <ChevronDown className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>
                                {selectedWorkspace?.name}
                                <p className="text-xs font-normal text-muted-foreground">
                                    {selectedWorkspace?.description}
                                </p>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <InviteMemberModal>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                    <UserPlus className="mr-2 h-4 w-4" />
                                    Convidar membros
                                </DropdownMenuItem>
                            </InviteMemberModal>
                            <DropdownMenuItem onClick={(e) => { e.preventDefault(); handleWorkspaceSettings() }}>
                                <Settings className="mr-2 h-4 w-4" />
                                Configurações
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleChangeWorkspace}>
                                <Users className="mr-2 h-4 w-4" />
                                Trocar workspace
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Dropdown do usuário */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                                        {user?.name ? getUserInitials(user.name) : 'U'}
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>
                                {user?.name || 'Usuário'}
                                <p className="text-xs font-normal text-muted-foreground">
                                    {user?.email}
                                </p>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <div className="px-2 py-1">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Tema</span>
                                    <ThemeSelector />
                                </div>
                            </div>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={logout}>
                                <LogOut className="mr-2 h-4 w-4" />
                                Sair
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    )
}