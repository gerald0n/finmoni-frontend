export interface User {
    id: string
    name: string
    email: string
    createdAt?: string
    updatedAt?: string
}

export interface LoginRequest {
    email: string
    password: string
}

export interface SignUpRequest {
    name: string
    email: string
    password: string
}

export interface LoginResponse {
    accessToken: string
}

export type SignUpResponse = User

export interface ApiError {
    statusCode: number
    message: string | string[]
    error: string
}

export type Theme = 'light' | 'dark' | 'system'

// Workspace types
export type WorkspaceRole = 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER'
export type InviteStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'EXPIRED' | 'CANCELLED'

export interface Workspace {
    id: string
    name: string
    description?: string
    createdAt: string
    updatedAt: string
    creatorId: string
    creator?: User
    members?: WorkspaceMember[]
    invites?: WorkspaceInvite[]
    currentUserRole?: WorkspaceRole
    _count?: {
        members: number
    }
}

export interface WorkspaceMember {
    id: string
    role: WorkspaceRole
    joinedAt: string
    updatedAt: string
    userId: string
    workspaceId: string
    user?: User
}

export interface WorkspaceInvite {
    id: string
    email: string
    role: WorkspaceRole
    status: InviteStatus
    token: string
    message?: string
    expiresAt: string
    createdAt: string
    updatedAt: string
    acceptedAt?: string
    senderId: string
    workspaceId: string
    sender?: User
    workspace?: Workspace
    acceptedById?: string
    acceptedBy?: User
}

// Workspace DTOs
export interface CreateWorkspaceRequest {
    name: string
    description?: string
}

export interface UpdateWorkspaceRequest {
    name?: string
    description?: string
}

export interface InviteMemberRequest {
    email: string
    role: WorkspaceRole
    message?: string
}

export interface UpdateMemberRoleRequest {
    role: WorkspaceRole
}

export interface AcceptInviteRequest {
    token: string
}

export interface AcceptInviteResponse {
    id: string
    role: WorkspaceRole
    userId: string
    workspaceId: string
    joinedAt: string
    workspace: Workspace
    user: User
}

export interface UpdateMemberRoleResponse {
    id: string
    role: WorkspaceRole
    joinedAt: string
    updatedAt: string
    user: User
}