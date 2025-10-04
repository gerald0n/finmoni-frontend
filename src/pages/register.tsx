import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ErrorMessage } from '@/components/ui/error'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { LoadingSpinner } from '@/components/ui/loading'
import { useSignUp } from '@/hooks/use-auth'
import { authSchemas, type RegisterFormData } from '@/lib/validations'

export function RegisterPage() {
    const signUpMutation = useSignUp()

    const form = useForm<RegisterFormData>({
        resolver: zodResolver(authSchemas.register),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    })

    const onSubmit = (data: RegisterFormData) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { confirmPassword, ...signUpData } = data
        signUpMutation.mutate(signUpData)
    }

    return (
        <div className="flex items-center justify-center min-h-screen px-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Criar Conta</CardTitle>
                    <CardDescription className="text-center">
                        Preencha os dados abaixo para criar sua conta no FinMoni
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nome completo</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Seu nome completo"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

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
                                                placeholder="Mínimo 8 caracteres"
                                                type="password"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirmar senha</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Digite a senha novamente"
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
                                disabled={signUpMutation.isPending}
                            >
                                {signUpMutation.isPending && (
                                    <LoadingSpinner size="sm" className="mr-2" />
                                )}
                                {signUpMutation.isPending ? 'Criando conta...' : 'Criar conta'}
                            </Button>

                            {signUpMutation.error && (
                                <ErrorMessage
                                    message={signUpMutation.error.message}
                                    onRetry={() => signUpMutation.reset()}
                                />
                            )}

                            {signUpMutation.isSuccess && (
                                <div className="rounded-md border border-green-200 bg-green-50 p-3 text-center text-sm text-green-800">
                                    Conta criada com sucesso! Redirecionando para o login...
                                </div>
                            )}
                        </form>
                    </Form>

                    <div className="mt-6 text-center text-sm text-muted-foreground">
                        Já tem uma conta?{' '}
                        <Link to="/auth/login" className="text-primary hover:underline font-medium transition-colors">
                            Faça login
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}