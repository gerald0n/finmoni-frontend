import { Loader2 } from 'lucide-react'
import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg'
    className?: string
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-6 w-6',
        lg: 'h-8 w-8',
    }

    return (
        <Loader2
            className={cn('animate-spin', sizeClasses[size], className)}
        />
    )
}

interface LoadingOverlayProps {
    isLoading: boolean
    children: ReactNode
    loadingText?: string
}

export function LoadingOverlay({
    isLoading,
    children,
    loadingText = 'Carregando...'
}: LoadingOverlayProps) {
    if (isLoading) {
        return (
            <div className="flex min-h-[200px] items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                    <LoadingSpinner size="lg" />
                    <p className="text-sm text-muted-foreground">{loadingText}</p>
                </div>
            </div>
        )
    }

    return <>{children}</>
}