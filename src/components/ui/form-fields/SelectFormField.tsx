import { X } from 'lucide-react'
import { type ReactNode } from 'react'
import { useController, type Control, type FieldPath, type FieldValues } from 'react-hook-form'

import { Button } from '@/components/ui/button'
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
                    <SelectTrigger className={`${icon ? 'pl-10' : ''} ${!required && field.value ? 'pr-10' : ''} ${error ? 'border-red-500' : ''}`}>
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

                {!required && field.value && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted z-10"
                        onClick={(e) => {
                            e.preventDefault()
                            field.onChange('')
                        }}
                    >
                        <X className="h-3 w-3" />
                    </Button>
                )}
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