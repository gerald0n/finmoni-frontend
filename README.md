# FinMoni Frontend

Sistema de gestão financeira pessoal desenvolvido com React, TypeScript e Vite.

## 🚀 Tecnologias

- **React 18** - Biblioteca para interfaces de usuário
- **TypeScript** - JavaScript com tipos estáticos
- **Vite** - Build tool e dev server ultra-rápido
- **ESLint** - Linter para qualidade de código
- **Prettier** - Formatador de código
- **Husky** - Git hooks para qualidade de código

## 📁 Estrutura do Projeto

```
src/
├── assets/          # Imagens, ícones e outros arquivos estáticos
├── components/      # Componentes React reutilizáveis
│   └── ui/         # Componentes básicos de interface
├── constants/       # Constantes da aplicação
├── contexts/        # Contextos React
├── hooks/          # Custom hooks
├── pages/          # Páginas da aplicação
├── services/       # Serviços de API
├── styles/         # Estilos globais
├── types/          # Definições de tipos TypeScript
└── utils/          # Funções utilitárias
```

## 🛠️ Instalação

```bash
# Instalar dependências
npm install

# Configurar hooks do Git
npm run prepare

# Copiar arquivo de ambiente
cp .env.example .env
```

## 🚀 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Preview do build
npm run preview

# Linting
npm run lint
npm run lint:fix

# Formatação
npm run format
npm run format:check

# Verificação de tipos
npm run type-check
```

## 🔧 Configurações

### TypeScript
- Strict mode habilitado
- Path mapping configurado para imports mais limpos
- Configurações otimizadas para React e Vite

### ESLint
- Regras para TypeScript, React e acessibilidade
- Integração com Prettier
- Detecção automática de versão do React

### Prettier
- Configuração padrão para formatação consistente
- Integração com ESLint

### Husky & lint-staged
- Pre-commit hooks para linting e formatação
- Garantia de qualidade de código

## 🎨 Convenções de Código

- Use PascalCase para componentes React
- Use camelCase para funções e variáveis
- Use UPPER_SNAKE_CASE para constantes
- Prefira arrow functions para componentes
- Use TypeScript para tipagem forte

## 📝 Commits

Este projeto usa convenções de commit semânticas:

```
feat: nova funcionalidade
fix: correção de bug
docs: documentação
style: formatação, ponto e vírgula, etc
refactor: refatoração de código
test: adição de testes
chore: mudanças no build, auxiliares, etc
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request
