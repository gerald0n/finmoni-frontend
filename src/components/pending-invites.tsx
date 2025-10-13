import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Check, Clock, Mail, X } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { useToast } from '@/hooks/use-toast'
import { workspaceService } from '@/services/workspace'
import type { WorkspaceInvite } from '@/types'

interface PendingInvitesProps {
    invites: WorkspaceInvite[]
}

export function PendingInvites({ invites }: PendingInvitesProps) {
    const queryClient = useQueryClient()
    const { toast } = useToast()
    const [confirmDialog, setConfirmDialog] = useState<{
        open: boolean
        invite: WorkspaceInvite | null
    }>({ open: false, invite: null })

    // Mutation para aceitar convite
    const acceptInviteMutation = useMutation({
        mutationFn: (token: string) => workspaceService.acceptInvite({ token }),
        onSuccess: () => {
            // Atualizar as queries após aceitar
            queryClient.invalidateQueries({ queryKey: ['workspaces'] })
            queryClient.invalidateQueries({ queryKey: ['pending-invites'] })
        },
    })

    // Mutation para recusar convite
    const declineInviteMutation = useMutation({
        mutationFn: workspaceService.declineInvite,
        onSuccess: () => {
            toast({
                title: 'Convite recusado com sucesso',
                description: 'Você não fará mais parte deste workspace.',
            })
            // Atualizar apenas os convites pendentes
            queryClient.invalidateQueries({ queryKey: ['pending-invites'] })
        },
        onError: (error) => {
            toast({
                variant: 'destructive',
                title: error instanceof Error ? error.message : 'Erro ao recusar convite',
                description: 'Tente novamente em alguns instantes.',
            })
        },
    })

    const handleAcceptInvite = (invite: WorkspaceInvite) => {
        acceptInviteMutation.mutate(invite.token)
    }

    const handleDeclineInvite = (invite: WorkspaceInvite) => {
        setConfirmDialog({ open: true, invite })
    }

    const confirmDeclineInvite = () => {
        if (confirmDialog.invite) {
            declineInviteMutation.mutate({ token: confirmDialog.invite.token })
        }
        setConfirmDialog({ open: false, invite: null })
    }

    const isProcessing = () => {
        return acceptInviteMutation.isPending || declineInviteMutation.isPending
    }

    if (!invites || invites.length === 0) {
        return null
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold">Convites Pendentes</h3>
                <div className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                    {invites.length}
                </div>
            </div>

            <div className="space-y-3">
                {invites.map((invite) => (
                    <Card key={invite.id} className="border-l-4 border-l-blue-500">
                        <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h4 className="font-semibold text-lg">
                                            {invite.workspace?.name}
                                        </h4>
                                        <div className="flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">
                                            <Clock className="h-3 w-3" />
                                            Pendente
                                        </div>
                                    </div>

                                    {invite.workspace?.description && (
                                        <p className="text-sm text-muted-foreground mb-2">
                                            {invite.workspace.description}
                                        </p>
                                    )}

                                    <div className="space-y-1 text-sm text-muted-foreground">
                                        <p>
                                            <span className="font-medium">Convidado por:</span> {invite.sender?.name || 'Usuário'}
                                        </p>
                                        <p>
                                            <span className="font-medium">Papel:</span>{' '}
                                            <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
                                                {invite.role}
                                            </span>
                                        </p>
                                        {invite.message && (
                                            <p className="italic">&ldquo;{invite.message}&rdquo;</p>
                                        )}
                                        <p>
                                            <span className="font-medium">Recebido em:</span>{' '}
                                            {new Date(invite.createdAt).toLocaleDateString('pt-BR')}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-2 ml-4">
                                    <Button
                                        size="sm"
                                        onClick={() => handleAcceptInvite(invite)}
                                        disabled={isProcessing()}
                                        className="bg-green-600 hover:bg-green-700"
                                    >
                                        <Check className="h-4 w-4 mr-1" />
                                        Aceitar
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleDeclineInvite(invite)}
                                        disabled={isProcessing()}
                                        className="border-red-200 text-red-700 hover:bg-red-50"
                                    >
                                        <X className="h-4 w-4 mr-1" />
                                        Recusar
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="text-xs text-muted-foreground">
                💡 Aceite um convite para participar do workspace ou recuse se não deseja participar.
            </div>

            <ConfirmDialog
                open={confirmDialog.open}
                onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}
                title="Recusar Convite"
                description={`Tem certeza que deseja recusar o convite para ${confirmDialog.invite?.workspace?.name}?`}
                confirmText="Recusar"
                cancelText="Cancelar"
                variant="destructive"
                onConfirm={confirmDeclineInvite}
            />
        </div>
    )
}