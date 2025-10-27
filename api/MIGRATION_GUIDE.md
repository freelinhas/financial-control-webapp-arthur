# Guia de Migração: SQLite para PostgreSQL

## 📋 Alterações Realizadas

### 1. Dependências Atualizadas (`package.json`)
- ✅ **Removido**: `sqlite3`
- ✅ **Adicionado**: `pg` (driver do PostgreSQL)

### 2. Configuração do Banco de Dados (`app.module.ts`)
- ✅ Migrado de configuração estática para dinâmica usando variáveis de ambiente
- ✅ Alterado tipo de banco de dados de `sqlite` para `postgres`
- ✅ Implementado configuração assíncrona com `forRootAsync`

### 3. Arquivo de Configuração
- ✅ Criado `.env.example` como modelo
- ✅ `.gitignore` já estava configurado para ignorar `.env`

## 🚀 Próximos Passos

### 1. Instalar as Dependências
```bash
cd api
npm install
```

### 2. Criar o Arquivo `.env`
Copie o arquivo `.env.example` e renomeie para `.env`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais do PostgreSQL:

```env
# Database Configuration
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=sua_senha_aqui
DB_DATABASE=financial_control

# Application
PORT=3000
```

### 3. Instalar e Configurar o PostgreSQL

#### No Windows:
1. Baixe o PostgreSQL em: https://www.postgresql.org/download/windows/
2. Execute o instalador e siga os passos
3. Anote a senha que você definir para o usuário `postgres`

#### Via Docker (Recomendado):
```bash
docker run --name postgres-financial \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=financial_control \
  -p 5432:5432 \
  -d postgres:15
```

### 4. Criar o Banco de Dados
Se você não criou via Docker, conecte-se ao PostgreSQL e crie o banco:

```sql
CREATE DATABASE financial_control;
```

### 5. Iniciar a Aplicação
```bash
npm run start:dev
```

O TypeORM irá criar automaticamente as tabelas no PostgreSQL na primeira execução (devido ao `synchronize: true`).

## ⚠️ Observações Importantes

### Sobre `synchronize: true`
- **Desenvolvimento**: OK usar `synchronize: true`
- **Produção**: NUNCA use `synchronize: true`
  - Use migrations para controle de versão do schema
  - Para criar migrations:
    ```bash
    npm run typeorm migration:generate -- -n MigrationName
    npm run typeorm migration:run
    ```

### Migração de Dados Existentes
Se você tem dados no SQLite que precisa migrar:

1. **Exportar dados do SQLite**:
   ```bash
   sqlite3 db.sqlite .dump > dump.sql
   ```

2. **Converter e importar para PostgreSQL**:
   - Você precisará ajustar a sintaxe SQL do SQLite para PostgreSQL
   - Ferramentas úteis:
     - `pgloader` - ferramenta automática de migração
     - Scripts customizados usando TypeORM

### Diferenças entre SQLite e PostgreSQL

| Recurso | SQLite | PostgreSQL |
|---------|--------|------------|
| Tipos de dados | Menos rigoroso | Mais rigoroso |
| Auto-increment | `AUTOINCREMENT` | `SERIAL` ou `SEQUENCE` |
| Boolean | INTEGER (0/1) | BOOLEAN nativo |
| Decimal | Armazenado como texto | Tipo NUMERIC/DECIMAL |

### Verificação de Tipos
Algumas colunas podem precisar de ajustes:
- ✅ `@Column('decimal', { precision: 10, scale: 2 })` - OK para ambos
- ✅ `@Column({ type: 'boolean' })` - OK para ambos (TypeORM abstrai)
- ✅ `@PrimaryGeneratedColumn()` - OK para ambos

## 🔧 Solução de Problemas

### Erro de Conexão
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solução**: Verifique se o PostgreSQL está rodando:
```bash
# Windows (Services)
services.msc

# Docker
docker ps
```

### Erro de Autenticação
```
Error: password authentication failed for user "postgres"
```
**Solução**: Verifique as credenciais no arquivo `.env`

### Tabelas não criadas
**Solução**: Com `synchronize: true`, as tabelas são criadas automaticamente. Verifique:
1. Se a conexão está funcionando
2. Se as entities estão sendo carregadas corretamente
3. Logs da aplicação no startup

## 📝 Estrutura das Entidades (Mantida)
As seguintes entidades foram mantidas sem alterações:
- ✅ User
- ✅ Category
- ✅ Transaction

## 🎯 Benefícios da Migração

1. **Performance**: PostgreSQL é mais rápido para operações complexas
2. **Escalabilidade**: Melhor para aplicações com múltiplos usuários
3. **Recursos Avançados**: Transações ACID completas, índices avançados, etc.
4. **Produção**: PostgreSQL é mais adequado para ambientes de produção
5. **Tipos de Dados**: Suporte a tipos mais complexos (JSON, Arrays, etc.)

## 🗑️ Limpeza Pós-Migração

Após confirmar que tudo está funcionando corretamente com PostgreSQL:

```bash
# Backup do SQLite (opcional, mas recomendado)
cp db.sqlite db.sqlite.backup

# Remover o arquivo SQLite (após confirmar que não precisa mais)
# rm db.sqlite
```

**Importante**: Mantenha o arquivo `db.sqlite` até ter certeza de que todos os dados foram migrados corretamente!

## 📚 Recursos Adicionais

- [Documentação TypeORM](https://typeorm.io/)
- [Documentação PostgreSQL](https://www.postgresql.org/docs/)
- [NestJS Database](https://docs.nestjs.com/techniques/database)

