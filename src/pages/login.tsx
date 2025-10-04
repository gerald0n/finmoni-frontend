import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ErrorMessage } from '@/components/ui/error'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { LoadingSpinner } from '@/components/ui/loading'
import { useLogin } from '@/hooks/use-auth'
import { authSchemas, type LoginFormData } from '@/lib/validations'

export function LoginPage() {
    const loginMutation = useLogin()

    const form = useForm<LoginFormData>({
        resolver: zodResolver(authSchemas.login),
        defaultValues: {
            email: '',
            password: '',
        },
    })

    const onSubmit = (data: LoginFormData) => {
        loginMutation.mutate(data)
    }

    return (
        <div className="flex items-center justify-center min-h-screen px-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">FinMoni</CardTitle>
                    <CardDescription className="text-center">
                        Entre com suas credenciais para acessar sua conta
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="seu@email.com"
                                                type="email"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Senha</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Sua senha"
                                                type="password"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={loginMutation.isPending}
                            >
                                {loginMutation.isPending && (
                                    <LoadingSpinner size="sm" className="mr-2" />
                                )}
                                {loginMutation.isPending ? 'Entrando...' : 'Entrar'}
                            </Button>

                            {loginMutation.error && (
                                <ErrorMessage
                                    message={loginMutation.error.message}
                                    onRetry={() => loginMutation.reset()}
                                />
                            )}
                        </form>
                    </Form>

                    <div className="mt-6 text-center text-sm text-muted-foreground">
                        Não tem uma conta?{' '}
                        <Link to="/auth/register" className="text-primary hover:underline font-medium transition-colors">
                            Cadastre-se
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}