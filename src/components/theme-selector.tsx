import { Check, Monitor, Moon, Sun } from 'lucide-react'
import type { ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTheme } from '@/hooks/use-theme'
import type { Theme } from '@/types'

interface ThemeOption {
    value: Theme
    label: string
    icon: ReactNode
}

const themes: ThemeOption[] = [
    {
        value: 'light',
        label: 'Claro',
        icon: <Sun className="h-4 w-4" />,
    },
    {
        value: 'dark',
        label: 'Escuro',
        icon: <Moon className="h-4 w-4" />,
    },
    {
        value: 'system',
        label: 'Sistema',
        icon: <Monitor className="h-4 w-4" />,
    },
]

export function ThemeSelector() {
    const { theme, setTheme } = useTheme()
    const currentTheme = themes.find((t) => t.value === theme)

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    {currentTheme?.icon}
                    <span className="sr-only">Selecionar tema</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
                {themes.map((themeOption) => (
                    <DropdownMenuItem
                        key={themeOption.value}
                        onClick={() => setTheme(themeOption.value)}
                        className="cursor-pointer"
                    >
                        <div className="flex w-full items-center justify-between">
                            <div className="flex items-center gap-2">
                                {themeOption.icon}
                                <span>{themeOption.label}</span>
                            </div>
                            {theme === themeOption.value && <Check className="h-4 w-4" />}
                        </div>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}