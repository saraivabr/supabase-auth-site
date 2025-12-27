# Guia de Autenticação entre Domínios

Este guia explica como usar este site SSO para autenticar usuários em vários subdomínios do seu domínio.

## Índice

- [Visão Geral](#visão-geral)
- [Arquitetura](#arquitetura)
- [Início Rápido](#início-rápido)
- [Configuração do Site SSO](#configuração-do-site-sso)
- [Integração do Site de Negócios](#integração-do-site-de-negócios)
- [Integração de Backend](#integração-de-backend)
- [Desenvolvimento Local](#desenvolvimento-local)
- [Considerações de Segurança](#considerações-de-segurança)
- [Solução de Problemas](#solução-de-problemas)

---

## Visão Geral

### Caso de Uso

Você tem vários sites em diferentes subdomínios que precisam compartilhar autenticação:

- **Site SSO**: `auth.exemplo.com` - Autenticação centralizada
- **Sites de Negócios**: `console.exemplo.com`, `app.exemplo.com`, `exemplo.com` - Suas aplicações

### Como Funciona

1. Usuário faz login em `auth.exemplo.com`
2. Sessão é armazenada em um **cookie** com `domain=.exemplo.com`
3. Todos os subdomínios podem ler a sessão do cookie
4. Sites de negócios extraem JWT da sessão e enviam para o backend
5. Backend valida JWT e autentica o usuário

### Principais Recursos

- ✅ Logon único em todos os subdomínios
- ✅ Extração automática de JWT e anexação de cabeçalho
- ✅ Nenhum gerenciamento manual de token necessário
- ✅ Compartilhamento seguro de sessão baseado em cookie
- ✅ Fluxo PKCE para segurança OAuth

---

## Arquitetura

```
┌─────────────────────────────────────────────────────────────────┐
│                      Navegador do Usuário                       │
│                                                                 │
│  Cookie: sb-xxx-auth-token (domain=.exemplo.com)                │
│  {                                                              │
│    "access_token": "eyJhbGc...",  ← JWT para backend           │
│    "refresh_token": "...",                                      │
│    "user": {...}                                                │
│  }                                                              │
└─────────────────────────────────────────────────────────────────┘
         │                                    │
         │ 1. Login                           │ 2. Usar sessão
         ↓                                    ↓
┌──────────────────────┐          ┌──────────────────────┐
│   auth.exemplo.com   │          │ console.exemplo.com  │
│   (Site SSO)         │          │ (Site de Negócios)   │
│                      │          │                      │
│  - Formulários login │          │  - Ler cookie        │
│  - Consentimento     │          │  - Extrair JWT       │
│  - Criação sessão    │          │  - Chamar API        │
└──────────────────────┘          └──────────────────────┘
         │                                    │
         │                                    │ Authorization: Bearer <JWT>
         │                                    ↓
         │                        ┌──────────────────────┐
         │                        │   api.exemplo.com    │
         │                        │ (Backend Negócios)   │
         │                        │                      │
         └───────────────────────→│  - Validar JWT       │
           Supabase Compartilhado │  - Autenticar usuário│
                                  │  - Retornar dados    │
                                  └──────────────────────┘
```

---

## Início Rápido

### 1. Configuração do Site SSO (Este Projeto)

**Configure as variáveis de ambiente:**

```bash
# .env
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon
VITE_ADMIN_EMAILS=admin@exemplo.com
```

**Configure via Interface Admin:**

1. Navegue até `https://auth.exemplo.com/console`
2. Vá para **Configurações de Autenticação**
3. Defina **Domínio do Cookie (SSO)** como `.exemplo.com`

**Implante em `auth.exemplo.com`**

### 2. Configuração do Site de Negócios

**Instale as dependências:**

```bash
npm install @supabase/supabase-js js-cookie
npm install -D @types/js-cookie
```

**Copie arquivos deste projeto:**

1. `src/lib/cookieStorage.ts`
2. `src/lib/supabase.ts`
3. `src/lib/apiClient.ts` (opcional, para chamadas de API)

**Configure o ambiente:**

```bash
# .env
VITE_SUPABASE_URL=https://xxx.supabase.co  # Mesmo do site SSO
VITE_SUPABASE_ANON_KEY=sua-chave-anon      # Mesmo do site SSO
```

**Use no seu app:**

```typescript
import { supabase } from './lib/supabase'
import { api } from './lib/apiClient'

// Verificar se o usuário está logado
const { data: { session } } = await supabase.auth.getSession()

if (session) {
  console.log('Usuário:', session.user.email)

  // Chamar sua API de negócios (JWT anexado automaticamente)
  const data = await api.get('/users')
}
```

---

## Configuração do Site SSO

Este projeto já está configurado para autenticação entre domínios. Apenas configure as variáveis de ambiente:

### Variáveis de Ambiente

```bash
# .env

# Supabase (Obrigatório)
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-aqui

# Acesso Admin (Obrigatório)
VITE_ADMIN_EMAILS=admin@exemplo.com

# URL Base da API (Opcional)
VITE_API_BASE_URL=https://api.exemplo.com
```

### Configuração SSO

A maioria das configurações, incluindo o **Domínio do Cookie**, agora é gerenciada através do **Painel Admin** integrado em `/console`. Isso permite que você atualize a configuração do seu site sem reimplantar.

1. Faça login no Painel Admin.
2. Navegue até **Configurações de Autenticação**.
3. Atualize o **Domínio do Cookie (SSO)** (ex: `.exemplo.com`).

### Implantação

Implante no seu subdomínio SSO (ex: `auth.exemplo.com`):

**Vercel:**
```bash
vercel --prod
# Defina domínio: auth.exemplo.com
# Adicione variáveis de ambiente no painel Vercel
```

**Netlify:**
```bash
netlify deploy --prod
# Defina domínio: auth.exemplo.com
# Adicione variáveis de ambiente no painel Netlify
```

**Docker:**
```bash
docker build -t sso-site .
docker run -p 80:80 \
  -e VITE_SUPABASE_URL=https://xxx.supabase.co \
  -e VITE_SUPABASE_ANON_KEY=xxx \
  -e VITE_ADMIN_EMAILS=admin@exemplo.com \
  sso-site
```

---

## Integração do Site de Negócios

### Passo 1: Instalar Dependências

```bash
npm install @supabase/supabase-js js-cookie
npm install -D @types/js-cookie
```

### Passo 2: Copiar Arquivos Necessários

Copie estes arquivos deste projeto para o seu site de negócios:

```
src/lib/cookieStorage.ts  → seu-app/src/lib/cookieStorage.ts
src/lib/supabase.ts       → seu-app/src/lib/supabase.ts
src/lib/apiClient.ts      → seu-app/src/lib/apiClient.ts (opcional)
```

### Passo 3: Configurar Ambiente

```bash
# seu-app/.env

# Deve corresponder à configuração do site SSO
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-aqui

# Sua API de backend
VITE_API_BASE_URL=https://api.exemplo.com
```

### Passo 4: Usar no Seu App

#### Verificar Status de Autenticação

```typescript
import { supabase } from '@/lib/supabase'

async function checkAuth() {
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    // Redirecionar para login SSO
    window.location.href = 'https://auth.exemplo.com/signin?redirect=' +
      encodeURIComponent(window.location.href)
    return
  }

  console.log('Logado como:', session.user.email)
  return session.user
}
```

#### Chamar API de Negócios

```typescript
import { api } from '@/lib/apiClient'

// Método 1: Usar cliente API (recomendado)
const users = await api.get('/users')
const newUser = await api.post('/users', { name: 'João' })

// Método 2: Fetch manual
const { data: { session } } = await supabase.auth.getSession()
const response = await fetch('https://api.exemplo.com/users', {
  headers: {
    'Authorization': `Bearer ${session.access_token}`,
  }
})
```

#### Exemplo React

```typescript
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { api } from '@/lib/apiClient'

function App() {
  const [user, setUser] = useState(null)
  const [data, setData] = useState(null)

  useEffect(() => {
    // Verificar status de autenticação
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        window.location.href = 'https://auth.exemplo.com/signin'
        return
      }
      setUser(session.user)
    })

    // Ouvir mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (user) {
      // Buscar dados da API de negócios
      api.get('/users').then(setData)
    }
  }, [user])

  if (!user) return <div>Carregando...</div>

  return (
    <div>
      <h1>Bem-vindo, {user.email}</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
```

---

## Integração de Backend

Seu backend precisa validar o JWT enviado no cabeçalho `Authorization`.

### Obter Segredo JWT

1. Vá para [Painel Supabase](https://app.supabase.com)
2. Selecione seu projeto
3. Vá para **Configurações** → **API**
4. Copie o **Segredo JWT** (em "Configurações JWT")

⚠️ **Mantenha este segredo seguro! Nunca faça commit dele no controle de versão.**

### Node.js / Express

```typescript
import express from 'express'
import jwt from 'jsonwebtoken'

const app = express()
const SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET!

// Middleware de autenticação
function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Não autorizado' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const payload = jwt.verify(token, SUPABASE_JWT_SECRET, {
      audience: 'authenticated',
    })

    req.user = {
      id: payload.sub,
      email: payload.email,
      // ... outros campos do JWT
    }

    next()
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' })
  }
}

// Rota protegida
app.get('/users', authenticateJWT, (req, res) => {
  console.log('ID do Usuário:', req.user.id)
  res.json({ users: [...] })
})

app.listen(3001)
```

### Python / Flask

```python
from flask import Flask, request, jsonify
import jwt
import os

app = Flask(__name__)
SUPABASE_JWT_SECRET = os.getenv('SUPABASE_JWT_SECRET')

def authenticate_jwt():
    auth_header = request.headers.get('Authorization', '')

    if not auth_header.startswith('Bearer '):
        return None

    token = auth_header.split(' ')[1]

    try:
        payload = jwt.decode(
            token,
            SUPABASE_JWT_SECRET,
            algorithms=['HS256'],
            audience='authenticated'
        )
        return {
            'id': payload['sub'],
            'email': payload['email'],
        }
    except jwt.InvalidTokenError:
        return None

@app.route('/users')
def get_users():
    user = authenticate_jwt()

    if not user:
        return jsonify({'error': 'Não autorizado'}), 401

    print(f"ID do Usuário: {user['id']}")
    return jsonify({'users': [...]})

if __name__ == '__main__':
    app.run(port=3001)
```

### Go

```go
package main

import (
    "net/http"
    "os"
    "strings"

    "github.com/golang-jwt/jwt/v5"
    "github.com/gin-gonic/gin"
)

var jwtSecret = []byte(os.Getenv("SUPABASE_JWT_SECRET"))

func authenticateJWT() gin.HandlerFunc {
    return func(c *gin.Context) {
        authHeader := c.GetHeader("Authorization")

        if !strings.HasPrefix(authHeader, "Bearer ") {
            c.JSON(401, gin.H{"error": "Não autorizado"})
            c.Abort()
            return
        }

        tokenString := strings.TrimPrefix(authHeader, "Bearer ")

        token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
            return jwtSecret, nil
        })

        if err != nil || !token.Valid {
            c.JSON(401, gin.H{"error": "Token inválido"})
            c.Abort()
            return
        }

        claims := token.Claims.(jwt.MapClaims)
        c.Set("user_id", claims["sub"])
        c.Set("email", claims["email"])

        c.Next()
    }
}

func main() {
    r := gin.Default()

    r.GET("/users", authenticateJWT(), func(c *gin.Context) {
        userID := c.GetString("user_id")
        c.JSON(200, gin.H{"user_id": userID})
    })

    r.Run(":3001")
}
```

---

## Desenvolvimento Local

### Desafio

Cookies com `domain=.exemplo.com` não funcionam em `localhost`.

### Solução 1: Usar `/etc/hosts` (Recomendado)

**Edite seu arquivo hosts:**

```bash
# macOS/Linux
sudo nano /etc/hosts

# Windows
# Edite C:\Windows\System32\drivers\etc\hosts
```

**Adicione estas linhas:**

```
127.0.0.1  auth.local.dev
127.0.0.1  console.local.dev
127.0.0.1  api.local.dev
```

**Configure via Interface Admin:**

1. Navegue até `http://auth.local.dev:3000/console`
2. Defina **Domínio do Cookie (SSO)** como `.local.dev`

**Execute seus apps:**

```bash
# Site SSO (porta 3000)
npm run dev
# Visite: http://auth.local.dev:3000

# Site de negócios (porta 3001)
cd ../business-site && npm run dev
# Visite: http://console.local.dev:3001
```

### Solução 2: Não Definir Domínio do Cookie

Se você não definir um **Domínio do Cookie** no Painel Admin, ele usará como padrão o hostname atual (ex: `localhost`). Isso funciona para testes em um único domínio, mas o SSO não funcionará em diferentes subdomínios ou portas.

---

## Considerações de Segurança

### Segurança de Cookie

O armazenamento de cookie é configurado com as melhores práticas de segurança:

```typescript
{
  domain: '.exemplo.com',  // Entre subdomínios
  path: '/',               // Todos os caminhos
  sameSite: 'Lax',        // Proteção CSRF
  secure: true,           // Apenas HTTPS em produção
  expires: 365            // 1 ano
}
```

### Pontos Importantes

1. **HTTPS Obrigatório em Produção**
   - Cookies com `secure: true` funcionam apenas via HTTPS
   - Desenvolvimento local usa `secure: false` automaticamente

2. **Proteção do Segredo JWT**
   - Nunca exponha `SUPABASE_JWT_SECRET` no código frontend
   - Use apenas em servidores backend
   - Armazene como variável de ambiente

3. **Configuração CORS**
   - Sua API backend deve permitir requisições dos seus domínios
   - Exemplo (Express):
   ```typescript
   app.use(cors({
     origin: [
       'https://auth.exemplo.com',
       'https://console.exemplo.com',
       'https://exemplo.com'
     ],
     credentials: true
   }))
   ```

4. **Melhores Práticas de Domínio de Cookie**
   - Use `.exemplo.com` (com ponto) para compartilhar entre subdomínios
   - Não use em `localhost` no desenvolvimento
   - Esteja ciente: qualquer subdomínio pode ler o cookie

---

## Solução de Problemas

### Sessão Não Compartilhada Entre Subdomínios

**Problema:** Usuário faz login em `auth.exemplo.com` mas `console.exemplo.com` não vê a sessão.

**Solução:**
1. Verifique se o **Domínio do Cookie (SSO)** no Painel Admin está definido como `.exemplo.com` (com ponto)
2. Verifique se ambos os sites usam o **mesmo projeto Supabase**
3. Verifique DevTools do navegador → Application → Cookies
4. Certifique-se de que o domínio do cookie mostra `.exemplo.com`

### Validação JWT Falha no Backend

**Problema:** Backend retorna `401 Não autorizado` ou "Token inválido"

**Solução:**
1. Verifique se você está usando o `SUPABASE_JWT_SECRET` correto
2. Verifique se a audiência JWT é `'authenticated'`
3. Certifique-se de que o token não expirou
4. Debug: Decodifique JWT em [jwt.io](https://jwt.io) para inspecionar claims

### Cookie Não Definido no Navegador

**Problema:** Nenhum cookie aparece no DevTools

**Solução:**
1. Verifique se o **Domínio do Cookie** está configurado corretamente no Painel Admin
2. Verifique se você está em HTTPS em produção
3. Verifique o console do navegador para erros
4. Tente limpar cache e cookies do navegador

### Loop de Redirecionamento de Login

**Problema:** Usuário continua sendo redirecionado para a página de login

**Solução:**
1. Verifique se `detectSessionInUrl: true` na configuração do supabase
2. Verifique se a URL de callback está configurada no Painel Supabase
3. Verifique se o navegador permite cookies (não no modo anônimo/privado)

### Problemas de Cookie em Desenvolvimento Local

**Problema:** Cookies não funcionam em `localhost`

**Solução:**
1. Use `/etc/hosts` para configurar domínios locais (veja [Desenvolvimento Local](#desenvolvimento-local))
2. Ou deixe o **Domínio do Cookie** vazio no Painel Admin para desenvolvimento local

---

## Tópicos Avançados

### Logout em Todos os Subdomínios

```typescript
import { supabase } from '@/lib/supabase'

async function logout() {
  await supabase.auth.signOut()

  // Opcional: Redirecionar para o site SSO
  window.location.href = 'https://auth.exemplo.com/signin'
}
```

O cookie de sessão é removido automaticamente, desconectando o usuário de todos os subdomínios.

### Tratamento de Token de Atualização

Supabase lida automaticamente com a atualização de token com `autoRefreshToken: true`:

```typescript
// Nenhuma atualização manual necessária!
const { data: { session } } = await supabase.auth.getSession()

// Sessão é atualizada automaticamente se expirada
```

### Claims JWT Personalizadas

Se você precisar de claims personalizadas no JWT, configure-as no Supabase:

1. Vá para Painel Supabase → Autenticação → Políticas
2. Adicione claims personalizadas aos metadados de `auth.users`
3. Elas aparecerão automaticamente no JWT

### Múltiplos Ambientes

Como a configuração é armazenada no Storage do seu projeto Supabase, cada ambiente (produção, staging, local) terá sua própria configuração naturalmente ao conectá-los a diferentes projetos Supabase:

**Variáveis de Ambiente do Site SSO:**
```bash
# .env.production
VITE_SUPABASE_URL=https://prod.supabase.co

# .env.staging
VITE_SUPABASE_URL=https://staging.supabase.co
```

**Configurações do Painel Admin do Site SSO:**
- Produção: Defina domínio como `.exemplo.com`
- Staging: Defina domínio como `.staging.exemplo.com`

**Variáveis de Ambiente do Site de Negócios:**
(Sites de negócios ainda usam variáveis de ambiente para corresponder à configuração SSO)
```bash
# seu-app/.env.production
VITE_COOKIE_DOMAIN=.exemplo.com

# seu-app/.env.staging
VITE_COOKIE_DOMAIN=.staging.exemplo.com
```

---

## Resumo

**Arquivos Chave:**
- `src/lib/cookieStorage.ts` - Adaptador de armazenamento de cookie
- `src/lib/supabase.ts` - Cliente Supabase com armazenamento de cookie
- `src/lib/apiClient.ts` - Cliente API com JWT automático

**Configuração Chave:**
- **Domínio do Cookie** - Configurado no Painel Admin do site SSO (habilita entre subdomínios)
- `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` - Mesmo em todos os sites
- `SUPABASE_JWT_SECRET` - Validação de backend (mantenha secreto!)

**Fluxo:**
1. Usuário faz login em `auth.exemplo.com`
2. Sessão armazenada em cookie usando domínio do Painel Admin
3. Site de negócios lê cookie via cliente Supabase (configurado com o mesmo domínio)
4. JWT extraído e enviado para API backend
5. Backend valida JWT e autentica usuário

Para mais ajuda, veja:
- [README.md](./README.md) - Configuração geral
- [Documentação Supabase](https://supabase.com/docs/guides/auth)
