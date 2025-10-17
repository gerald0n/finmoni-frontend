import type { HTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

type SkeletonProps = HTMLAttributes<HTMLDivElement>

function Skeleton({
    className,
    ...props
}: SkeletonProps) {
    return (
        <div
            className={cn(
                'animate-pulse rounded-md bg-muted',
                className
            )}
            {...props}
        />
    )
}

// Skeleton específico para cards de conta bancária
function BankAccountCardSkeleton() {
    return (
        <div className="bg-card rounded-lg border p-4 space-y-4">
            <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                    <div className="flex items-center space-x-2">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Skeleton className="h-3 w-3" />
                        <Skeleton className="h-3 w-40" />
                    </div>
                </div>
                <div className="flex space-x-1">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex items-center space-x-2">
                    <Skeleton className="h-3 w-3" />
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-5 w-20" />
                </div>
                <div className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-5 w-24" />
                </div>
                <Skeleton className="h-3 w-32" />
            </div>
        </div>
    )
}

// Skeleton para lista de contas bancárias
function BankAccountsListSkeleton() {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-10 w-28" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                    <BankAccountCardSkeleton key={i} />
                ))}
            </div>
        </div>
    )
}

// Skeleton para cartão de crédito individual
function CreditCardSkeleton() {
    return (
        <div className="relative aspect-[1.586/1] w-full max-w-xs rounded-lg p-3 shadow-lg bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400 dark:from-slate-700 dark:via-slate-800 dark:to-slate-900 flex flex-col justify-between overflow-hidden text-sm">
            {/* Padrão de fundo decorativo */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white"></div>
                <div className="absolute -left-8 -bottom-8 w-24 h-24 rounded-full bg-white"></div>
            </div>

            {/* Conteúdo do card */}
            <div className="relative z-10 flex flex-col h-full justify-between">
                {/* Topo: Número do cartão */}
                <Skeleton className="h-5 w-48 bg-white/20" />

                {/* Meio: Nome do titular e tipo */}
                <div className="space-y-1.5">
                    <Skeleton className="h-3 w-24 bg-white/20" />
                    <Skeleton className="h-4 w-32 bg-white/20" />
                    <Skeleton className="h-3 w-16 bg-white/20" />
                </div>

                {/* Base: Limite, Vencimento */}
                <div className="flex items-end justify-between">
                    <div className="flex gap-3">
                        <div className="space-y-1">
                            <Skeleton className="h-2.5 w-10 bg-white/20" />
                            <Skeleton className="h-3 w-12 bg-white/20" />
                        </div>
                        <div className="space-y-1">
                            <Skeleton className="h-2.5 w-10 bg-white/20" />
                            <Skeleton className="h-3 w-16 bg-white/20" />
                        </div>
                    </div>
                    <Skeleton className="h-6 w-10 bg-white/20" />
                </div>
            </div>
        </div>
    )
}

// Skeleton para lista de cartões de crédito
function CreditCardsListSkeleton() {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-10 w-32" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <CreditCardSkeleton key={i} />
                ))}
            </div>
        </div>
    )
}

// Skeleton para tabela genérica
function TableSkeleton({
    rows = 5,
    columns = 4
}: {
    rows?: number
    columns?: number
}) {
    return (
        <div className="space-y-3">
            <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
                {Array.from({ length: columns }).map((_, i) => (
                    <Skeleton key={i} className="h-4" />
                ))}
            </div>
            {Array.from({ length: rows }).map((_, rowIndex) => (
                <div key={rowIndex} className="grid gap-3" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
                    {Array.from({ length: columns }).map((_, colIndex) => (
                        <Skeleton key={colIndex} className="h-8" />
                    ))}
                </div>
            ))}
        </div>
    )
}

// Skeleton para página de dashboard
function DashboardSkeleton() {
    return (
        <div className="space-y-8 p-6">
            <div className="space-y-2">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-96" />
            </div>

            <BankAccountsListSkeleton />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="bg-card rounded-lg border p-6 space-y-2">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-4 w-full" />
                    </div>
                ))}
            </div>
        </div>
    )
}

export {
    Skeleton,
    BankAccountCardSkeleton,
    BankAccountsListSkeleton,
    CreditCardsListSkeleton,
    TableSkeleton,
    DashboardSkeleton
}