import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Mail, UserPlus } from 'lucide-react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { workspaceService } from '@/services/workspace'
import type { RootState } from '@/store'
import type { WorkspaceRole } from '@/types'

const inviteFormSchema = z.object({
    email: z
        .string()
        .min(1, 'Email é obrigatório')
        .email('Digite um email válido')
        .max(255, 'Email muito longo'),
    role: z.enum(['ADMIN', 'MEMBER', 'VIEWER'] as const, {
        required_error: 'Selecione um papel para o usuário',
    }),
    message: z
        .string()
        .max(500, 'Mensagem muito longa')
        .optional(),
})

type InviteFormValues = z.infer<typeof inviteFormSchema>

const roleLabels: Record<WorkspaceRole, string> = {
    OWNER: 'Proprietário',
    ADMIN: 'Administrador',
    MEMBER: 'Membro',
    VIEWER: 'Visualizador',
}

const roleDescriptions: Record<WorkspaceRole, string> = {
    OWNER: 'Acesso total ao workspace',
    ADMIN: 'Pode gerenciar membros e configurações',
    MEMBER: 'Pode criar e editar conteúdo',
    VIEWER: 'Apenas visualização',
}

interface InviteMemberModalProps {
    children: React.ReactNode
}

export function InviteMemberModal({ children }: InviteMemberModalProps) {
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const selectedWorkspace = useSelector((state: RootState) => state.auth.selectedWorkspace)

    const form = useForm<InviteFormValues>({
        resolver: zodResolver(inviteFormSchema),
        defaultValues: {
            email: '',
            role: 'MEMBER',
            message: '',
        },
    })

    const onSubmit = async (values: InviteFormValues) => {
        if (!selectedWorkspace) {
            alert('Nenhum workspace selecionado')
            return
        }

        setIsLoading(true)
        try {
            const inviteData = {
                email: values.email,
                role: values.role,
                ...(values.message && { message: values.message })
            }
            await workspaceService.inviteMember(selectedWorkspace.id, inviteData)
            alert(`Convite enviado para ${values.email}`)
            form.reset()
            setOpen(false)
        } catch (error) {
            alert(
                error instanceof Error
                    ? error.message
                    : 'Erro ao enviar convite. Tente novamente.'
            )
        } finally {
            setIsLoading(false)
        }
    }

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen)
        if (!newOpen) {
            form.reset()
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <UserPlus className="h-5 w-5" />
                        Convidar membro
                    </DialogTitle>
                    <DialogDescription>
                        Envie um convite para que outra pessoa possa participar do workspace{' '}
                        <span className="font-medium">{selectedWorkspace?.name}</span>.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email do convidado</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                placeholder="exemplo@email.com"
                                                className="pl-10"
                                                type="email"
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormDescription>
                                        A pessoa receberá um email com o convite.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Papel no workspace</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione o papel" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {(['ADMIN', 'MEMBER', 'VIEWER'] as const).map((role) => (
                                                <SelectItem key={role} value={role}>
                                                    <div className="flex flex-col">
                                                        <span>{roleLabels[role]}</span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {roleDescriptions[role]}
                                                        </span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        Define o que o membro poderá fazer no workspace.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="message"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mensagem personalizada (opcional)</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Venha colaborar conosco no FinMoni!"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Uma mensagem amigável que será incluída no convite.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpen(false)}
                                disabled={isLoading}
                            >
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Enviar convite
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}