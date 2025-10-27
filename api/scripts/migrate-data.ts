import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

// Carrega variáveis de ambiente
dotenv.config();

/**
 * Script para migrar dados do SQLite para PostgreSQL
 * 
 * Uso:
 * 1. Certifique-se de ter ambos os bancos de dados disponíveis
 * 2. Execute: npx ts-node scripts/migrate-data.ts
 */

// Configuração do SQLite (fonte)
const sqliteDataSource = new DataSource({
  type: 'sqlite',
  database: 'db.sqlite',
  entities: ['dist/**/*.entity.js'],
});

// Configuração do PostgreSQL (destino)
const postgresDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'financial_control',
  entities: ['dist/**/*.entity.js'],
  synchronize: true,
});

async function migrateData() {
  try {
    console.log('🔄 Iniciando migração de dados...\n');

    // Conectar aos bancos
    console.log('📦 Conectando ao SQLite...');
    await sqliteDataSource.initialize();
    console.log('✅ SQLite conectado!\n');

    console.log('🐘 Conectando ao PostgreSQL...');
    await postgresDataSource.initialize();
    console.log('✅ PostgreSQL conectado!\n');

    // Obter entidades
    const entities = sqliteDataSource.entityMetadatas;

    // Migrar cada entidade
    for (const entity of entities) {
      const tableName = entity.tableName;
      console.log(`📋 Migrando tabela: ${tableName}`);

      // Buscar dados do SQLite
      const sqliteRepo = sqliteDataSource.getRepository(entity.target);
      const data = await sqliteRepo.find();

      if (data.length === 0) {
        console.log(`   ⚠️  Nenhum dado encontrado em ${tableName}\n`);
        continue;
      }

      // Inserir no PostgreSQL
      const postgresRepo = postgresDataSource.getRepository(entity.target);
      
      // Limpar tabela de destino (opcional)
      // await postgresRepo.clear();
      
      await postgresRepo.save(data);
      console.log(`   ✅ ${data.length} registro(s) migrado(s) de ${tableName}\n`);
    }

    console.log('🎉 Migração concluída com sucesso!');

  } catch (error) {
    console.error('❌ Erro durante a migração:', error);
    throw error;
  } finally {
    // Fechar conexões
    if (sqliteDataSource.isInitialized) {
      await sqliteDataSource.destroy();
      console.log('\n📦 Conexão SQLite fechada');
    }
    if (postgresDataSource.isInitialized) {
      await postgresDataSource.destroy();
      console.log('🐘 Conexão PostgreSQL fechada');
    }
  }
}

// Executar migração
migrateData()
  .then(() => {
    console.log('\n✨ Script finalizado!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Falha na migração:', error);
    process.exit(1);
  });

