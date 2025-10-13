import { type ReactNode } from 'react'
import { useController, type Control, type FieldPath, type FieldValues } from 'react-hook-form'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface TextFormFieldProps<T extends FieldValues> {
    name: FieldPath<T>
    control: Control<T>
    label: string
    description?: string
    placeholder?: string
    required?: boolean
    icon?: ReactNode
    className?: string
}

export function TextFormField<T extends FieldValues>({
    name,
    control,
    label,
    description,
    placeholder,
    required,
    icon,
    className,
}: TextFormFieldProps<T>) {
    const {
        field,
        fieldState: { error },
    } = useController({
        name,
        control,
    })

    return (
        <div className={`space-y-2 ${className}`}>
            <Label htmlFor={name}>
                {label} {required && <span className="text-red-500">*</span>}
            </Label>

            <div className="relative">
                {icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        {icon}
                    </div>
                )}

                <Input
                    {...field}
                    id={name}
                    type="text"
                    placeholder={placeholder}
                    className={`${icon ? 'pl-10' : ''} ${error ? 'border-red-500' : ''}`}
                    value={field.value || ''}
                />
            </div>

            {description && (
                <p className="text-xs text-muted-foreground">{description}</p>
            )}

            {error && (
                <p className="text-xs text-red-500">{error.message}</p>
            )}
        </div>
    )
}