import Cookies from 'js-cookie'

import { API_CONFIG, STORAGE_KEYS } from '@/config/constants'
import type {
    ApiError,
    Workspace,
    CreateWorkspaceRequest,
    UpdateWorkspaceRequest,
    InviteMemberRequest,
    UpdateMemberRoleRequest,
    AcceptInviteRequest,
    AcceptInviteResponse,
    UpdateMemberRoleResponse,
    WorkspaceInvite
} from '@/types'

class WorkspaceServiceClass {
    private getHeaders() {
        const token = Cookies.get(STORAGE_KEYS.AUTH_TOKEN)
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }

    private async makeRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
        const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                ...this.getHeaders(),
                ...options?.headers,
            },
        })

        if (!response.ok) {
            const error: ApiError = await response.json()
            throw new Error(Array.isArray(error.message) ? error.message[0] : error.message)
        }

        // Para respostas 204 (No Content), não tentar fazer parse JSON
        if (response.status === 204) {
            return {} as T
        }

        return response.json()
    }

    // Listar workspaces do usuário
    async getWorkspaces(): Promise<Workspace[]> {
        return this.makeRequest<Workspace[]>('/workspaces')
    }

    // Buscar workspace específico
    async getWorkspace(id: string): Promise<Workspace> {
        return this.makeRequest<Workspace>(`/workspaces/${id}`)
    }

    // Criar workspace
    async createWorkspace(data: CreateWorkspaceRequest): Promise<Workspace> {
        return this.makeRequest<Workspace>('/workspaces', {
            method: 'POST',
            body: JSON.stringify(data),
        })
    }

    // Atualizar workspace
    async updateWorkspace(id: string, data: UpdateWorkspaceRequest): Promise<Workspace> {
        return this.makeRequest<Workspace>(`/workspaces/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        })
    }

    // Deletar workspace
    async deleteWorkspace(id: string): Promise<void> {
        return this.makeRequest<void>(`/workspaces/${id}`, {
            method: 'DELETE',
        })
    }

    // Convidar membro
    async inviteMember(workspaceId: string, data: InviteMemberRequest): Promise<WorkspaceInvite> {
        return this.makeRequest<WorkspaceInvite>(`/workspaces/${workspaceId}/invites`, {
            method: 'POST',
            body: JSON.stringify(data),
        })
    }

    // Listar convites pendentes do usuário
    async getPendingInvites(): Promise<WorkspaceInvite[]> {
        return this.makeRequest<WorkspaceInvite[]>('/workspaces/invites/pending')
    }

    // Aceitar convite
    async acceptInvite(data: AcceptInviteRequest): Promise<AcceptInviteResponse> {
        return this.makeRequest<AcceptInviteResponse>('/workspaces/invites/accept', {
            method: 'POST',
            body: JSON.stringify(data),
        })
    }

    // Recusar convite
    async declineInvite(data: AcceptInviteRequest): Promise<void> {
        return this.makeRequest<void>('/workspaces/invites/decline', {
            method: 'POST',
            body: JSON.stringify(data),
        })
    }

    // Atualizar role de membro
    async updateMemberRole(
        workspaceId: string,
        memberId: string,
        data: UpdateMemberRoleRequest
    ): Promise<UpdateMemberRoleResponse> {
        return this.makeRequest<UpdateMemberRoleResponse>(`/workspaces/${workspaceId}/members/${memberId}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        })
    }

    // Remover membro
    async removeMember(workspaceId: string, memberId: string): Promise<void> {
        return this.makeRequest<void>(`/workspaces/${workspaceId}/members/${memberId}`, {
            method: 'DELETE',
        })
    }

    // Sair do workspace
    async leaveWorkspace(workspaceId: string): Promise<void> {
        return this.makeRequest<void>(`/workspaces/${workspaceId}/leave`, {
            method: 'DELETE',
        })
    }

    // Salvar workspace selecionado localmente (mantido para persistência)
    saveSelectedWorkspace(workspace: Workspace): void {
        localStorage.setItem(STORAGE_KEYS.SELECTED_WORKSPACE, JSON.stringify(workspace))
    }

    // Obter workspace selecionado do localStorage
    getSelectedWorkspace(): Workspace | null {
        const workspace = localStorage.getItem(STORAGE_KEYS.SELECTED_WORKSPACE)
        return workspace ? JSON.parse(workspace) : null
    }

    // Remover workspace selecionado do localStorage
    removeSelectedWorkspace(): void {
        localStorage.removeItem(STORAGE_KEYS.SELECTED_WORKSPACE)
    }

    // Verificar se usuário tem workspace selecionado
    hasSelectedWorkspace(): boolean {
        return !!this.getSelectedWorkspace()
    }
}

export const workspaceService = new WorkspaceServiceClass()