export function DashboardPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
                <p className="text-muted-foreground">Bem-vindo ao seu painel de controle</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-card rounded-lg border p-6">
                    <h3 className="text-lg font-semibold text-card-foreground">Estrutura Base</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                        Dashboard configurado e pronto para desenvolvimento
                    </p>
                </div>
            </div>
        </div>
    )
}
