import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { runSeed } from './seed';
import { User } from '../../user/entities/user.entity';
import { Category } from '../../category/entities/category.entity';
import { Transaction } from '../../transaction/entities/transaction.entity';

// Carregar variáveis de ambiente
dotenv.config();

// Configuração do DataSource
const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'financial_control',
  entities: [User, Category, Transaction],
  synchronize: false, // Não alterar schema, apenas popular
});

async function bootstrap() {
  console.log('🔌 Conectando ao banco de dados...\n');

  try {
    // Conectar ao banco
    await AppDataSource.initialize();
    console.log('✅ Conectado ao PostgreSQL!\n');

    // Executar seed
    await runSeed(AppDataSource);

    // Fechar conexão
    await AppDataSource.destroy();
    console.log('🔌 Conexão fechada.\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro fatal:', error);
    
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
    
    process.exit(1);
  }
}

// Executar
bootstrap();

