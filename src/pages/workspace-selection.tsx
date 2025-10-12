import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Plus, Users } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'

import { PendingInvites } from '@/components/pending-invites'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ErrorMessage } from '@/components/ui/error'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { LoadingSpinner } from '@/components/ui/loading'
import { workspaceService } from '@/services/workspace'
import type { RootState } from '@/store'
import { setSelectedWorkspace } from '@/store'
import type { CreateWorkspaceRequest, Workspace } from '@/types'

const createWorkspaceSchema = z.object({
    name: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome não pode ter mais de 100 caracteres'),
    description: z.string().max(500, 'Descrição não pode ter mais de 500 caracteres').optional(),
})

type CreateWorkspaceFormData = z.infer<typeof createWorkspaceSchema>

export default function WorkspaceSelection() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const currentUser = useSelector((state: RootState) => state.auth.user)
    const [showCreateForm, setShowCreateForm] = useState(false)

    const form = useForm<CreateWorkspaceFormData>({
        resolver: zodResolver(createWorkspaceSchema),
        defaultValues: {
            name: '',
            description: '',
        },
    })

    // Query para listar workspaces
    const { data: workspaces, isLoading, error, refetch } = useQuery({
        queryKey: ['workspaces'],
        queryFn: async () => {
            const allWorkspaces = await workspaceService.getWorkspaces()

            // CORREÇÃO: Filtrar apenas workspaces onde o usuário é membro efetivo
            // Problema: API pode retornar workspaces com convites pendentes
            // Solução: Só mostrar workspaces onde currentUserRole está definido
            return allWorkspaces.filter(workspace => {
                // Se currentUserRole existe, usuário é membro efetivo
                // Se não existe, pode ser apenas um convite pendente
                return workspace.currentUserRole !== undefined
            })
        },
    })

    // Query para listar convites pendentes
    const { data: pendingInvites } = useQuery({
        queryKey: ['pending-invites'],
        queryFn: async () => {
            const invites = await workspaceService.getPendingInvites()

            // CORREÇÃO: Filtrar apenas convites válidos e pendentes
            return invites.filter(invite => {
                // Verificar se está pendente e não expirado
                const isNotExpired = !invite.expiresAt || new Date(invite.expiresAt) > new Date()
                return invite.status === 'PENDING' && isNotExpired
            })
        },
    })

    // Mutation para criar workspace
    const createWorkspaceMutation = useMutation({
        mutationFn: (data: CreateWorkspaceRequest) => workspaceService.createWorkspace(data),
        onSuccess: (workspace) => {
            // Invalidar cache das queries para atualizar listas
            refetch()

            workspaceService.saveSelectedWorkspace(workspace, currentUser?.id)
            dispatch(setSelectedWorkspace(workspace))
            form.reset()
            navigate('/dashboard', { replace: true })
        },
    })

    const handleSelectWorkspace = (workspace: Workspace) => {
        workspaceService.saveSelectedWorkspace(workspace, currentUser?.id)
        dispatch(setSelectedWorkspace(workspace))
        navigate('/dashboard', { replace: true })
    }

    const handleCreateWorkspace = (data: CreateWorkspaceFormData) => {
        const payload: CreateWorkspaceRequest = {
            name: data.name,
            ...(data.description && { description: data.description })
        }
        createWorkspaceMutation.mutate(payload)
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoadingSpinner size="lg" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen px-4">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6">
                        <ErrorMessage
                            message={(error as Error).message}
                            onRetry={() => refetch()}
                        />
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="flex items-center justify-center min-h-screen px-4">
            <Card className="w-full max-w-2xl">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Selecionar Workspace</CardTitle>
                    <CardDescription className="text-center">
                        Escolha um workspace para continuar ou crie um novo
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {!showCreateForm ? (
                        <div className="space-y-6">
                            {/* Seção de convites pendentes */}
                            {pendingInvites && pendingInvites.length > 0 && (
                                <PendingInvites invites={pendingInvites} />
                            )}

                            {/* Seção de workspaces do usuário */}
                            {workspaces && workspaces.length > 0 ? (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <Users className="h-5 w-5 text-primary" />
                                        <h3 className="text-lg font-semibold">Meus Workspaces</h3>
                                    </div>
                                    <div className="grid gap-3">
                                        {workspaces.map((workspace) => (
                                            <Card
                                                key={workspace.id}
                                                className="cursor-pointer transition-colors hover:bg-muted/50 border-2 hover:border-primary"
                                                onClick={() => handleSelectWorkspace(workspace)}
                                            >
                                                <CardContent className="p-4">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex-1">
                                                            <h3 className="font-semibold text-lg">{workspace.name}</h3>
                                                            {workspace.description && (
                                                                <p className="text-sm text-muted-foreground mt-1">
                                                                    {workspace.description}
                                                                </p>
                                                            )}
                                                            <div className="flex items-center text-sm text-muted-foreground mt-2">
                                                                <Users className="h-4 w-4 mr-1" />
                                                                <span>
                                                                    {workspace._count?.members || 0} membro(s)
                                                                </span>
                                                                {workspace.currentUserRole && (
                                                                    <span className="ml-2 px-2 py-1 bg-primary/10 text-primary rounded-md text-xs font-medium">
                                                                        {workspace.currentUserRole}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>

                                    <div className="flex items-center justify-center pt-4">
                                        <div className="flex items-center text-sm text-muted-foreground">
                                            <span className="mr-2">Ou</span>
                                            <div className="flex-1 border-t" />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-muted-foreground mb-4">
                                        Você ainda não faz parte de nenhum workspace.
                                    </p>
                                </div>
                            )}

                            <div className="mt-6">
                                <Button
                                    className="w-full"
                                    variant="outline"
                                    onClick={() => setShowCreateForm(true)}
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Criar Novo Workspace
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold">Criar Novo Workspace</h3>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowCreateForm(false)}
                                >
                                    Voltar
                                </Button>
                            </div>

                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(handleCreateWorkspace)} className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Nome</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Finanças da Família"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Descrição (opcional)</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Workspace para colaboração em equipe"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="flex justify-end space-x-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setShowCreateForm(false)}
                                        >
                                            Cancelar
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={createWorkspaceMutation.isPending}
                                        >
                                            {createWorkspaceMutation.isPending && (
                                                <LoadingSpinner size="sm" className="mr-2" />
                                            )}
                                            {createWorkspaceMutation.isPending ? 'Criando...' : 'Criar Workspace'}
                                        </Button>
                                    </div>

                                    {createWorkspaceMutation.error && (
                                        <ErrorMessage
                                            message={createWorkspaceMutation.error.message}
                                            onRetry={() => createWorkspaceMutation.reset()}
                                        />
                                    )}
                                </form>
                            </Form>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
