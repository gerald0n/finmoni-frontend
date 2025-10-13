import { type ReactNode } from 'react'
import { useController, type Control, type FieldPath, type FieldValues } from 'react-hook-form'

import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

interface SelectFormFieldProps<T extends FieldValues> {
    name: FieldPath<T>
    control: Control<T>
    label: string
    description?: string
    placeholder?: string
    options: Array<{ value: string; label: string; sublabel?: string; disabled?: boolean }>
    required?: boolean
    icon?: ReactNode
    className?: string
}

export function SelectFormField<T extends FieldValues>({
    name,
    control,
    label,
    description,
    placeholder,
    options,
    required,
    icon,
    className,
}: SelectFormFieldProps<T>) {
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
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10">
                        {icon}
                    </div>
                )}

                <Select value={field.value || ''} onValueChange={field.onChange}>
                    <SelectTrigger className={`${icon ? 'pl-10' : ''} ${error ? 'border-red-500' : ''}`}>
                        <SelectValue placeholder={placeholder} />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 w-[var(--radix-select-trigger-width)]">
                        {options.map((option) => (
                            <SelectItem
                                key={option.value}
                                value={option.value}
                                {...(option.disabled && { disabled: true })}
                            >
                                {option.sublabel ? (
                                    <div className="flex flex-col">
                                        <span>{option.label}</span>
                                        <span className="text-xs text-muted-foreground">{option.sublabel}</span>
                                    </div>
                                ) : (
                                    option.label
                                )}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
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