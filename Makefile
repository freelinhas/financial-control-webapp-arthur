# Financial Control - Makefile
# Comandos para gerenciar o banco de dados e desenvolvimento

.PHONY: help dev dev-db stop-db restart-db clean-db logs-db status-db

# Variáveis
DOCKER_COMPOSE_FILE = api/docker-compose.yml
DB_SERVICE = postgres

# Comando padrão - mostra ajuda
help:
	@echo "Financial Control - Comandos disponíveis:"
	@echo ""
	@echo "Desenvolvimento:"
	@echo "  make dev          - Inicia banco + front + back"
	@echo "  make dev-db       - Inicia apenas o banco de dados"
	@echo "  make dev-full     - Inicia banco + seeds + front + back"
	@echo ""
	@echo "Gerenciamento do banco:"
	@echo "  make stop-db      - Para o banco de dados"
	@echo "  make restart-db   - Reinicia o banco de dados"
	@echo "  make clean-db     - Remove containers e volumes do banco"
	@echo "  make logs-db      - Mostra logs do banco"
	@echo "  make status-db    - Mostra status dos containers"
	@echo ""
	@echo "Seeds (dados iniciais):"
	@echo "  make seed         - Executa seeds no banco"
	@echo "  make seed-fresh   - Limpa banco e executa seeds"
	@echo ""
	@echo "Outros:"
	@echo "  make help         - Mostra esta ajuda"

# Inicia o ambiente completo (banco + front + back)
dev:
	@echo "🚀 Iniciando ambiente completo..."
	@echo "📦 Subindo banco de dados..."
	@docker-compose -f $(DOCKER_COMPOSE_FILE) up -d
	@echo "⏳ Aguardando banco ficar pronto..."
	@sleep 5
	@echo "🔧 Iniciando front e back..."
	@npm run dev

# Inicia apenas o banco de dados
dev-db:
	@echo "📦 Subindo banco de dados..."
	@docker-compose -f $(DOCKER_COMPOSE_FILE) up -d
	@echo "✅ Banco de dados iniciado!"
	@echo "🌐 PostgreSQL: localhost:5432"
	@echo "🔧 pgAdmin: http://localhost:5050"

# Para o banco de dados
stop-db:
	@echo "🛑 Parando banco de dados..."
	@docker-compose -f $(DOCKER_COMPOSE_FILE) down

# Reinicia o banco de dados
restart-db:
	@echo "🔄 Reiniciando banco de dados..."
	@docker-compose -f $(DOCKER_COMPOSE_FILE) restart

# Remove containers e volumes (CUIDADO: apaga dados!)
clean-db:
	@echo "⚠️  Removendo containers e volumes do banco..."
	@echo "⚠️  ATENÇÃO: Isso vai apagar todos os dados!"
	@read -p "Tem certeza? (y/N): " confirm && [ "$$confirm" = "y" ] || exit 1
	@docker-compose -f $(DOCKER_COMPOSE_FILE) down -v
	@docker volume prune -f

# Mostra logs do banco
logs-db:
	@echo "📋 Logs do banco de dados:"
	@docker-compose -f $(DOCKER_COMPOSE_FILE) logs -f

# Mostra status dos containers
status-db:
	@echo "📊 Status dos containers:"
	@docker-compose -f $(DOCKER_COMPOSE_FILE) ps

# Inicia ambiente completo com seeds
dev-full:
	@echo "🚀 Iniciando ambiente completo com seeds..."
	@echo "📦 Subindo banco de dados..."
	@docker-compose -f $(DOCKER_COMPOSE_FILE) up -d
	@echo "⏳ Aguardando banco ficar pronto..."
	@sleep 5
	@echo "🌱 Executando seeds..."
	@cd api && npm run seed
	@echo "🔧 Iniciando front e back..."
	@npm run dev

# Executa seeds no banco
seed:
	@echo "🌱 Executando seeds no banco..."
	@cd api && npm run seed

# Limpa banco e executa seeds (CUIDADO!)
seed-fresh:
	@echo "⚠️  Limpando banco e executando seeds..."
	@echo "⚠️  ATENÇÃO: Isso vai apagar todos os dados!"
	@read -p "Tem certeza? (y/N): " confirm && [ "$$confirm" = "y" ] || exit 1
	@docker-compose -f $(DOCKER_COMPOSE_FILE) down -v
	@docker-compose -f $(DOCKER_COMPOSE_FILE) up -d
	@echo "⏳ Aguardando banco ficar pronto..."
	@sleep 5
	@echo "🌱 Executando seeds..."
	@cd api && npm run seed
	@echo "✅ Seeds executados com sucesso!"
