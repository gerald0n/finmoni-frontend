import { ThemeSelector } from '@/components/theme-selector'
import { Button } from '@/components/ui/button'
import { useLogout } from '@/hooks/use-auth'
import { useTheme } from '@/hooks/use-theme'

export function DashboardPage() {
    const logout = useLogout()
    const { theme, isDark } = useTheme()

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="mx-auto max-w-4xl">
                <header className="mb-8 flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
                    <div className="flex items-center gap-3">
                        <ThemeSelector />
                        <Button onClick={logout} variant="outline">
                            Sair
                        </Button>
                    </div>
                </header>

                <main className="space-y-6">
                    <div className="rounded-lg border bg-card p-6 shadow-md">
                        <h2 className="mb-4 text-xl font-semibold text-card-foreground">
                            Bem-vindo ao FinMoni!
                        </h2>
                        <p className="mb-4 text-muted-foreground">
                            Sistema de gestão financeira pessoal. Login realizado com sucesso.
                        </p>

                        <div className="mb-4 rounded-lg bg-muted p-4">
                            <h3 className="mb-2 font-medium text-muted-foreground">Status do Tema:</h3>
                            <div className="flex items-center gap-2 text-sm">
                                <span className="rounded border bg-background px-2 py-1 font-mono">
                                    Tema: {theme}
                                </span>
                                <span className="rounded border bg-background px-2 py-1 font-mono">
                                    Modo: {isDark ? 'Escuro' : 'Claro'}
                                </span>
                            </div>
                        </div>

                        <p className="text-sm text-muted-foreground">
                            Use o seletor de tema no cabeçalho para alternar entre os modos disponíveis.
                        </p>
                    </div>
                </main>
            </div>
        </div>
    )
}