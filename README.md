<div align="center">
  <a href="https://github.com/saltbo/supabase-auth-site">
    <img src="public/tanstack-word-logo-white.svg" alt="Logo" width="80" height="80">
  </a>

  <h1 align="center">Supabase Auth Site</h1>

  <p align="center">
    <strong>Um portal de autenticação pronto para produção, totalmente configurável e alimentado pelo Supabase.</strong>
    <br />
    Implante suas próprias páginas de login personalizadas em minutos. Nenhuma alteração de código necessária.
    <br />
    <br />
    <a href="https://github.com/saltbo/supabase-auth-site/issues">Reportar Bug</a>
    ·
    <a href="https://github.com/saltbo/supabase-auth-site/issues">Solicitar Funcionalidade</a>
  </p>

  <p align="center">
    <img src="https://img.shields.io/github/license/saltbo/supabase-auth-site?style=flat-square" alt="License">
    <img src="https://img.shields.io/github/v/release/saltbo/supabase-auth-site?style=flat-square" alt="Release">
    <img src="https://img.shields.io/github/stars/saltbo/supabase-auth-site?style=flat-square" alt="Stars">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square" alt="PRs Welcome">
  </p>
</div>

---

## 🚀 Visão Geral

**Supabase Auth Site** é uma solução moderna de autenticação plug-and-play para seus projetos Supabase. Ele resolve o problema de construir e manter páginas de autenticação personalizadas (Login, Cadastro, Esqueci a Senha, OAuth) fornecendo uma aplicação pré-construída e altamente refinada que você pode implantar e configurar instantaneamente.

Ao contrário de outros templates, **você não precisa tocar no código**. Todos os aspectos do site—desde marca e cores até provedores de autenticação e configurações de segurança—são gerenciados através de um **Painel Admin** integrado.

## ✨ Principais Funcionalidades

| Funcionalidade | Descrição |
| ------- | ----------- |
| **🎨 Estilização Sem Código** | Personalize logo, cores, fontes e gradientes diretamente pela interface Admin. |
| **🔐 Suporte Multi-Autenticação** | Email/Senha, Magic Link (OTP), Google, GitHub e muito mais, prontos para usar. |
| **⚙️ Console** | Uma rota segura `/console` para gerenciar a configuração do seu site em tempo real. |
| **🌐 SSO entre Domínios** | Compartilhe sessões perfeitamente entre `auth.seudominio.com` e `app.seudominio.com`. |
| **📱 Responsivo para Mobile** | UI cuidadosamente elaborada que fica perfeita em desktop, tablet e mobile. |
| **🛡️ Pronto para Empresas** | Suporte integrado para Cloudflare Turnstile CAPTCHA e fluxo de segurança PKCE. |

## 🛠 Stack Tecnológica

Construído com as mais recentes e melhores tecnologias web para performance e experiência do desenvolvedor.

*   ![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
*   ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
*   ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
*   ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
*   ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
*   ![TanStack Router](https://img.shields.io/badge/TanStack_Router-FF4154?style=for-the-badge&logo=react-router&logoColor=white)

---

## 🏁 Começando

Recomendamos fortemente a estratégia **Fork & Deploy**. Isso mantém sua implantação vinculada ao repositório upstream, permitindo que você puxe atualizações facilmente.

### 1. Fazer Fork do Repositório

Clique no botão **Fork** no canto superior direito desta página para criar sua própria cópia do repositório.

### 2. Implantar

Conecte seu repositório bifurcado ao seu provedor de hospedagem preferido.

#### Cloudflare Pages (Recomendado)
1. Vá para **[Painel Cloudflare](https://dash.cloudflare.com/)** > **Pages** > **Connect to Git**.
2. Selecione seu repositório bifurcado.
3. **Configurações de Build**:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

#### Vercel / Netlify
1. Importe seu repositório bifurcado como um novo projeto.
2. A plataforma deve detectar automaticamente as configurações do Vite.

### 3. Configurar Variáveis de Ambiente

Adicione as seguintes variáveis de ambiente nas configurações da sua plataforma de implantação:

| Variável | Descrição |
| :--- | :--- |
| `VITE_SUPABASE_URL` | URL do seu Projeto Supabase (ex: `https://xyz.supabase.co`) |
| `VITE_SUPABASE_ANON_KEY` | Sua Chave Anon / Pública do Supabase |
| `VITE_ADMIN_EMAILS` | Lista de emails separados por vírgula com permissão para acessar o Painel Admin |

### 4. Configuração do Supabase

1. **Site URL**: No Painel Supabase > Autenticação > Configuração de URL, defina **Site URL** para seu domínio implantado (ex: `https://auth.seudominio.com`).
2. **Redirects**: Adicione `https://auth.seudominio.com/**` à lista de permissões das **URLs de Redirecionamento**.
3. **Storage**: Crie um novo bucket público chamado `auth-site` (se não for criado automaticamente) para armazenar sua configuração.

---

## 🎨 Configuração & Personalização

Uma vez implantado, você não precisa fazer commit de código para mudar a aparência.

1.  Navegue até `https://seu-site-implantado.com/console`
2.  Faça login com um endereço de email que você adicionou a `VITE_ADMIN_EMAILS`.
3.  **Inicializar**: Clique no botão para criar seu primeiro arquivo de configuração.
4.  **Editar**: Use o editor visual para atualizar:
    *   **Marca**: Envie seu logo e favicon.
    *   **Tema**: Escolha a cor da sua marca e gradientes da barra lateral.
    *   **Conteúdo**: Atualize o slogan, descrição e rodapé.
    *   **Funcionalidades**: Alterne provedores de autenticação específicos ou conteúdo da barra lateral.

> As alterações são salvas no seu Supabase Storage e propagadas imediatamente para todos os usuários.

---

## 🔄 Atualizações & Manutenção

Para atualizar seu site com os últimos recursos e patches de segurança:

1.  Navegue até seu repositório bifurcado no GitHub.
2.  Clique em **"Sync fork"** abaixo do cabeçalho do repositório.
3.  Sua plataforma de implantação acionará automaticamente um novo build.

---

## 📚 Documentação

*   [Guia de SSO entre Domínios](./docs/CROSS_DOMAIN_AUTH.md) - Aprenda como compartilhar sessões entre subdomínios.
*   [Diretrizes de Contribuição](./CONTRIBUTING.md) - Quer ajudar a melhorar o projeto?

## 📄 Licença

Distribuído sob a Licença MIT. Veja `LICENSE` para mais informações.