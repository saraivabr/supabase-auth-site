# Contribuindo para o Supabase Auth Site

Obrigado pelo seu interesse em contribuir para o Supabase Auth Site! Este documento fornece informações sobre a estrutura do projeto e o fluxo de trabalho de desenvolvimento.

## Estrutura do Projeto

```
supabase-auth-site/
├── site.config.ts              # Seu arquivo de personalização
├── site.config.default.ts      # Exemplo de config com todas as opções
├── site.config.types.ts        # Definições de tipo TypeScript
├── docs/
|   |---CROSS_DOMAIN_AUTH.md    # Guia de configuração de SSO entre domínios
├── src/
│   ├── components/
│   │   ├── auth/               # Componentes de formulário de autenticação
│   │   ├── oauth/              # Componentes de consentimento OAuth
│   │   ├── ui/                 # Componentes shadcn/ui
│   │   ├── Logo.tsx            # Componente de logo configurável
│   │   └── login-form.tsx      # Formulário de login principal
│   ├── layouts/
│   │   └── AuthLayout.tsx      # Layout de autenticação de duas colunas
│   ├── lib/
│   │   ├── auth.tsx            # Provedor de contexto de autenticação
│   │   ├── config.ts           # Utilitários de configuração
│   │   ├── supabase.ts         # Cliente Supabase (com armazenamento de cookie)
│   │   ├── cookieStorage.ts    # Adaptador de armazenamento de cookie para SSO
│   │   ├── apiClient.ts        # Cliente API com JWT automático
│   │   ├── theme.ts            # Injeção de tema
│   │   ├── redirect.ts         # Tratamento de redirecionamento
│   │   └── route-guards.ts     # Proteção de rotas
│   ├── routes/                 # Rotas baseadas em arquivo
│   │   ├── signin.tsx          # Página de login
│   │   ├── callback.tsx        # Callback OAuth
│   │   ├── verify-otp.tsx      # Verificação OTP
│   │   └── oauth/
│   │       └── consent.tsx     # Autorização OAuth
│   └── main.tsx                # Ponto de entrada da aplicação
├── public/                     # Assets estáticos
└── .env                        # Variáveis de ambiente
```

## Desenvolvimento

### Pré-requisitos

- Node.js (v20 ou posterior recomendado)
- npm ou yarn

### Configuração

1. Clone o repositório:
   ```bash
   git clone <repository-url>
   cd supabase-auth-site
   npm install
   ```

2. Configure o Ambiente:
   ```bash
   cp .env.example .env
   ```
   Edite `.env` e adicione suas credenciais do Supabase.

3. Execute o Servidor de Desenvolvimento:
   ```bash
   npm run dev
   ```
   Visite http://localhost:3000

### Scripts Disponíveis

- `npm run dev` - Iniciar servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run preview` - Pré-visualizar build de produção
- `npm run test` - Executar testes

### Adicionando Novos Componentes de UI

Este projeto usa shadcn/ui. Adicione componentes com:

```bash
npx shadcn@latest add <component-name>
```

Exemplo:

```bash
npx shadcn@latest add dialog
```

## Segurança para Desenvolvedores

- **Nunca faça commit do `.env`** - Ele contém credenciais sensíveis
- **Use variáveis de ambiente** - Não faça hardcode de segredos
- **Revisão de Código** - Garanta que nenhum segredo seja vazado em PRs

## Processo de Pull Request

1. Faça fork do repositório
2. Crie uma branch de funcionalidade (`git checkout -b feature/funcionalidade-incrivel`)
3. Faça suas alterações
4. Faça commit das suas alterações (`git commit -m 'Adiciona funcionalidade incrível'`)
5. Faça push para a branch (`git push origin feature/funcionalidade-incrivel`)
6. Abra um Pull Request

## Licença

Ao contribuir, você concorda que suas contribuições serão licenciadas sob sua Licença MIT.
