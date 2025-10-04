import { Moon, Sun, Monitor } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useTheme } from '@/hooks/use-theme'

export function ThemeToggle() {
    const { theme, isDark, toggleTheme } = useTheme()

    const getIcon = () => {
        switch (theme) {
            case 'light':
                return <Sun className="h-4 w-4" />
            case 'dark':
                return <Moon className="h-4 w-4" />
            case 'system':
                return <Monitor className="h-4 w-4" />
            default:
                return isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />
        }
    }

    const getTooltip = () => {
        switch (theme) {
            case 'light':
                return 'Trocar para tema escuro'
            case 'dark':
                return 'Trocar para tema claro'
            case 'system':
                return 'Usando tema do sistema'
            default:
                return 'Alternar tema'
        }
    }

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            title={getTooltip()}
            className="h-8 w-8 p-0"
        >
            {getIcon()}
            <span className="sr-only">Alternar tema</span>
        </Button>
    )
}