import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import {
  useCreateAccountMutation,
  useUpdateAccountMutation,
} from '@/services/accounts/hooks'
import { accountsUtils } from '@/services/accounts/index'
import { bankAccountSchema, type BankAccountFormData } from '@/services/accounts/schemas'
import type { BankAccount } from '@/types'

interface UseBankAccountFormProps {
  workspaceId: string
  account?: BankAccount | undefined
  onSuccess: () => void
}

export function useBankAccountForm({
  workspaceId,
  account,
  onSuccess,
}: UseBankAccountFormProps) {
  const isEditing = !!account

  const createMutation = useCreateAccountMutation(workspaceId)
  const updateMutation = useUpdateAccountMutation(workspaceId, account?.id || '')

  const form = useForm<BankAccountFormData>({
    resolver: zodResolver(bankAccountSchema),
    defaultValues: {
      name: '',
      bankCode: '',
      ownerId: '',
      initialBalance: '',
      agency: '',
      account: '',
    },
  })

  useEffect(() => {
    if (account) {
      form.reset({
        name: account.name,
        bankCode: account.bankCode || '',
        ownerId: account.ownerId || '',
        initialBalance: account.initialBalanceCents
          ? accountsUtils.centsToCurrency(account.initialBalanceCents)
          : '',
        agency: account.agency || '',
        account: account.account || '',
      })
    } else {
      form.reset({
        name: '',
        bankCode: '',
        ownerId: '',
        initialBalance: '',
        agency: '',
        account: '',
      })
    }
  }, [account, form])

  const onSubmit = (data: BankAccountFormData) => {
    const submitData = {
      name: data.name,
      bankCode: data.bankCode,
      ...(data.ownerId && { ownerId: data.ownerId }),
      ...(data.initialBalance && { initialBalance: data.initialBalance }),
      ...(data.agency && { agency: data.agency }),
      ...(data.account && { account: data.account }),
    }

    const mutation = isEditing ? updateMutation : createMutation

    mutation.mutate(submitData, {
      onSuccess: () => {
        onSuccess()
        form.reset()
      },
    })
  }

  const isLoading = createMutation.isPending || updateMutation.isPending

  return {
    form,
    isEditing,
    isLoading,
    onSubmit,
  }
}
