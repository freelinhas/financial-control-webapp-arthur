#!/bin/bash

# Financial Control - Script de desenvolvimento
# Este script automatiza a subida completa do ambiente

set -e  # Para o script se houver erro

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para imprimir mensagens coloridas
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Função para verificar se o Docker está rodando
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker não está rodando. Por favor, inicie o Docker primeiro."
        exit 1
    fi
}

# Função para verificar se o banco está pronto
wait_for_db() {
    print_status "Aguardando banco de dados ficar pronto..."
    
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if docker exec financial-control-db pg_isready -U postgres > /dev/null 2>&1; then
            print_success "Banco de dados está pronto!"
            return 0
        fi
        
        print_status "Tentativa $attempt/$max_attempts - Aguardando..."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    print_error "Banco de dados não ficou pronto a tempo"
    exit 1
}

# Função principal
main() {
    print_status "🚀 Iniciando Financial Control - Ambiente completo"
    
    # Verificar Docker
    check_docker
    
    # Subir banco de dados
    print_status "📦 Subindo banco de dados..."
    docker-compose -f api/docker-compose.yml up -d
    
    # Aguardar banco ficar pronto
    wait_for_db
    
    # Iniciar aplicações
    print_status "🔧 Iniciando front e back..."
    print_success "✅ Ambiente iniciado com sucesso!"
    print_status "🌐 PostgreSQL: localhost:5432"
    print_status "🔧 pgAdmin: http://localhost:5050"
    print_status "🚀 Frontend e Backend iniciando..."
    
    # Executar npm run dev
    npm run dev
}

# Função para executar seeds
run_seeds() {
    print_status "🌱 Executando seeds no banco..."
    cd api
    if npm run seed; then
        print_success "✅ Seeds executados com sucesso!"
        cd ..
    else
        print_error "❌ Erro ao executar seeds"
        cd ..
        exit 1
    fi
}

# Função de ajuda
show_help() {
    echo "Financial Control - Script de desenvolvimento"
    echo ""
    echo "Uso: $0 [opção]"
    echo ""
    echo "Opções:"
    echo "  start, dev    Inicia ambiente completo (banco + front + back)"
    echo "  dev-full      Inicia banco + seeds + front + back"
    echo "  db-only       Inicia apenas o banco de dados"
    echo "  seed          Executa seeds no banco"
    echo "  seed-fresh    Limpa banco e executa seeds"
    echo "  stop          Para o banco de dados"
    echo "  restart       Reinicia o banco de dados"
    echo "  logs          Mostra logs do banco"
    echo "  status        Mostra status dos containers"
    echo "  help          Mostra esta ajuda"
    echo ""
    echo "Exemplos:"
    echo "  $0 start      # Inicia tudo"
    echo "  $0 dev-full   # Inicia tudo com seeds"
    echo "  $0 seed       # Executa seeds"
    echo "  $0 db-only    # Só o banco"
    echo "  $0 stop       # Para o banco"
}

# Processar argumentos
case "${1:-start}" in
    "start"|"dev")
        main
        ;;
    "dev-full")
        print_status "🚀 Iniciando Financial Control - Ambiente completo com seeds"
        check_docker
        print_status "📦 Subindo banco de dados..."
        docker-compose -f api/docker-compose.yml up -d
        wait_for_db
        run_seeds
        print_status "🔧 Iniciando front e back..."
        print_success "✅ Ambiente iniciado com sucesso!"
        print_status "🌐 PostgreSQL: localhost:5432"
        print_status "🔧 pgAdmin: http://localhost:5050"
        print_status "🚀 Frontend e Backend iniciando..."
        npm run dev
        ;;
    "db-only")
        check_docker
        print_status "📦 Subindo apenas o banco de dados..."
        docker-compose -f api/docker-compose.yml up -d
        wait_for_db
        print_success "✅ Banco de dados iniciado!"
        print_status "🌐 PostgreSQL: localhost:5432"
        print_status "🔧 pgAdmin: http://localhost:5050"
        ;;
    "seed")
        check_docker
        wait_for_db
        run_seeds
        ;;
    "seed-fresh")
        print_warning "⚠️  Limpando banco e executando seeds..."
        print_warning "⚠️  ATENÇÃO: Isso vai apagar todos os dados!"
        read -p "Tem certeza? (y/N): " confirm
        if [ "$confirm" != "y" ]; then
            print_status "Operação cancelada."
            exit 0
        fi
        check_docker
        print_status "🛑 Parando e removendo containers..."
        docker-compose -f api/docker-compose.yml down -v
        print_status "📦 Subindo banco limpo..."
        docker-compose -f api/docker-compose.yml up -d
        wait_for_db
        run_seeds
        print_success "✅ Seeds executados com sucesso!"
        ;;
    "stop")
        print_status "🛑 Parando banco de dados..."
        docker-compose -f api/docker-compose.yml down
        print_success "✅ Banco de dados parado!"
        ;;
    "restart")
        print_status "🔄 Reiniciando banco de dados..."
        docker-compose -f api/docker-compose.yml restart
        wait_for_db
        print_success "✅ Banco de dados reiniciado!"
        ;;
    "logs")
        print_status "📋 Logs do banco de dados:"
        docker-compose -f api/docker-compose.yml logs -f
        ;;
    "status")
        print_status "📊 Status dos containers:"
        docker-compose -f api/docker-compose.yml ps
        ;;
    "help"|"-h"|"--help")
        show_help
        ;;
    *)
        print_error "Opção inválida: $1"
        show_help
        exit 1
        ;;
esac
