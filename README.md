# 💰 Controle Financeiro - Mobile PWA

Sistema de controle financeiro pessoal otimizado para mobile e PWA (Progressive Web App).

## 🚀 Características

- **📱 Mobile First**: Interface otimizada para smartphones
- **🔧 PWA**: Pode ser instalado como app nativo
- **💾 SQLite Local**: Banco de dados local, sem necessidade de servidor
- **🎯 Precisão Numérica**: Usa big.js (frontend) e decimal.js (backend)
- **🎨 Tema Cyberpunk**: Interface moderna e futurista
- **⚡ Sem Docker**: Execução direta, ideal para smartphones

## 🛠️ Tecnologias

### Backend (NestJS)
- NestJS + TypeScript
- SQLite (banco local)
- TypeORM
- JWT Authentication
- Decimal.js (precisão numérica)

### Frontend (Vue.js)
- Vue 3 + TypeScript
- Vuetify 3 (UI Framework)
- PWA (Progressive Web App)
- Big.js (precisão numérica)
- Pinia (State Management)

## 📦 Instalação e Execução

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Instalação Rápida
```bash
# Clone o repositório
git clone <seu-repo>
cd financial-control-webapp-arthur

# Execute o script de inicialização
node start-dev.js
```

### Instalação Manual

#### Backend
```bash
cd api
npm install
npm run start:dev
```

#### Frontend
```bash
cd web
npm install
npm run dev
```

## 🔧 Configuração

### Backend (.env)
Crie um arquivo `.env` na pasta `api` baseado no `env.example`:

```env
DB_DATABASE=./database.sqlite
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env)
Crie um arquivo `.env` na pasta `web` baseado no `env.example`:

```env
VITE_API_URL=http://localhost:3001
VITE_API_TIMEOUT=10000
VITE_APP_NAME=Controle Financeiro
VITE_APP_VERSION=1.0.0
VITE_PWA_NAME=FinanceApp
VITE_PWA_SHORT_NAME=FinanceApp
```

**Nota**: O frontend tem fallback para `http://localhost:3001` caso o `.env` não esteja configurado.

## 📱 Como Usar no Mobile

### 1. Acesso via Browser
- Acesse `http://seu-ip:3000` no navegador do celular
- O app detectará que está em mobile e otimizará a interface

### 2. Instalação como PWA
- No Chrome/Edge: Menu → "Instalar app"
- No Safari: Compartilhar → "Adicionar à Tela de Início"
- O app funcionará offline após a instalação

## 🏗️ Estrutura do Projeto

```
financial-control-webapp-arthur/
├── api/                    # Backend NestJS
│   ├── src/
│   │   ├── auth/          # Autenticação
│   │   ├── user/          # Usuários
│   │   ├── category/      # Categorias
│   │   ├── transaction/   # Transações
│   │   └── common/        # Utilitários
│   └── database.sqlite    # Banco SQLite (criado automaticamente)
├── web/                   # Frontend Vue.js
│   ├── src/
│   │   ├── components/    # Componentes Vue
│   │   ├── composables/   # Composables (useMoney, etc.)
│   │   ├── modules/       # Módulos da aplicação
│   │   └── services/      # Serviços HTTP
│   └── dist/              # Build PWA (após npm run build)
└── start-dev.js          # Script de inicialização
```

## 💰 Precisão Numérica

O sistema usa bibliotecas especializadas para evitar problemas de precisão com números decimais:

- **Frontend**: `big.js` - Para cálculos e formatação
- **Backend**: `decimal.js` - Para operações no servidor

### Exemplo de Uso
```typescript
import { useMoney } from '@/composables/useMoney'

const { add, format, create } = useMoney()

// Cálculos precisos
const total = add('10.50', '5.25') // Big.js
const formatted = format(total) // "R$ 15,75"
```

## 🎨 Tema e Interface

- **Tema Cyberpunk**: Cores neon e design futurista
- **Mobile First**: Interface otimizada para touch
- **Responsivo**: Adapta-se a diferentes tamanhos de tela
- **PWA**: Funciona offline e pode ser instalado

## 🔒 Autenticação

- JWT tokens para autenticação
- Senhas criptografadas com bcrypt
- Rotas protegidas automaticamente

## 📊 Funcionalidades

- ✅ Cadastro e login de usuários
- ✅ Gestão de categorias (Entrada/Saída)
- ✅ Controle de transações
- ✅ Dashboard com resumos financeiros
- ✅ Interface mobile otimizada
- ✅ PWA para instalação no celular
- ✅ Precisão numérica garantida

## 🚀 Deploy para Produção

### Backend
```bash
cd api
npm run build
npm run start:prod
```

### Frontend
```bash
cd web
npm run build
# Servir a pasta dist/ com qualquer servidor web
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

---

**Desenvolvido com ❤️ para controle financeiro pessoal**
