# 🚀 Quick Start - PostgreSQL

## Comandos Rápidos

### 1️⃣ Setup Inicial (1 minuto)
```bash
# Instalar dependências
npm install

# Iniciar PostgreSQL com Docker
docker-compose up -d

# Copiar configurações
cp .env.example .env

# Iniciar aplicação
npm run start:dev
```

### 2️⃣ Verificar se está funcionando
```bash
# Ver logs do PostgreSQL
docker-compose logs postgres

# Acessar pgAdmin
# Browser: http://localhost:5050
# Email: admin@admin.com
# Senha: admin
```

### 3️⃣ Migrar dados do SQLite (opcional)
```bash
# Se você tem dados antigos no SQLite
npm run migrate:data
```

## 📝 Arquivo .env

Mínimo necessário:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=financial_control
PORT=3000
```

## 🐳 Docker Commands

```bash
# Iniciar
docker-compose up -d

# Parar
docker-compose down

# Ver logs
docker-compose logs -f

# Reiniciar
docker-compose restart

# Parar e remover dados (⚠️ cuidado!)
docker-compose down -v
```

## 🔧 Troubleshooting

### PostgreSQL não conecta?
```bash
# Verificar se está rodando
docker ps

# Ver logs de erro
docker-compose logs postgres
```

### Esqueceu a senha?
Está no arquivo `docker-compose.yml`:
- Username: `postgres`
- Password: `postgres`
- Database: `financial_control`

### Resetar banco de dados?
```bash
# Parar e remover volumes
docker-compose down -v

# Iniciar novamente (banco limpo)
docker-compose up -d
```

## 📚 Mais Informações

- 📖 [Resumo Completo da Migração](./MIGRATION_SUMMARY.md)
- 📖 [Guia Detalhado](./MIGRATION_GUIDE.md)
- 📖 [README](./README.md)

