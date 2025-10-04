import { AlertCircle, RefreshCw } from 'lucide-react'
import type { ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface ErrorBoundaryProps {
    error?: Error | null
    resetError?: () => void
    children?: ReactNode
}

export function ErrorFallback({ error, resetError }: ErrorBoundaryProps) {
    return (
        <div className="flex min-h-[400px] items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                        <AlertCircle className="h-6 w-6 text-destructive" />
                    </div>
                    <CardTitle className="text-destructive">Oops! Algo deu errado</CardTitle>
                    <CardDescription>
                        Ocorreu um erro inesperado. Tente novamente ou recarregue a página.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {error && (
                        <div className="rounded-md bg-muted p-3">
                            <p className="text-sm font-mono text-muted-foreground">
                                {error.message}
                            </p>
                        </div>
                    )}
                    <div className="flex gap-2">
                        {resetError && (
                            <Button onClick={resetError} variant="outline" className="flex-1">
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Tentar novamente
                            </Button>
                        )}
                        <Button
                            onClick={() => window.location.reload()}
                            className="flex-1"
                        >
                            Recarregar página
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

interface ErrorMessageProps {
    message: string
    onRetry?: () => void
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
    return (
        <div className="flex items-center justify-between rounded-md border border-destructive/20 bg-destructive/5 p-3">
            <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <p className="text-sm text-destructive">{message}</p>
            </div>
            {onRetry && (
                <Button onClick={onRetry} size="sm" variant="outline">
                    <RefreshCw className="h-4 w-4" />
                </Button>
            )}
        </div>
    )
}