#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Iniciando o sistema de controle financeiro...\n');

// Função para executar comandos
function runCommand(command, args, cwd, name) {
  return new Promise((resolve, reject) => {
    console.log(`📦 Iniciando ${name}...`);
    
    const process = spawn(command, args, {
      cwd,
      stdio: 'inherit',
      shell: true
    });

    process.on('close', (code) => {
      if (code === 0) {
        console.log(`✅ ${name} finalizado com sucesso`);
        resolve();
      } else {
        console.log(`❌ ${name} falhou com código ${code}`);
        reject(new Error(`${name} falhou`));
      }
    });

    process.on('error', (error) => {
      console.log(`❌ Erro ao iniciar ${name}:`, error.message);
      reject(error);
    });
  });
}

// Função para criar arquivos .env se não existirem
function createEnvFiles() {
  const fs = require('fs');
  
  // Backend .env
  const backendEnvPath = path.join(__dirname, 'api', '.env');
  const backendEnvExamplePath = path.join(__dirname, 'api', 'env.example');
  
  if (!fs.existsSync(backendEnvPath) && fs.existsSync(backendEnvExamplePath)) {
    console.log('📝 Criando arquivo .env do backend...');
    fs.copyFileSync(backendEnvExamplePath, backendEnvPath);
  }
  
  // Frontend .env
  const frontendEnvPath = path.join(__dirname, 'web', '.env');
  const frontendEnvExamplePath = path.join(__dirname, 'web', 'env.example');
  
  if (!fs.existsSync(frontendEnvPath) && fs.existsSync(frontendEnvExamplePath)) {
    console.log('📝 Criando arquivo .env do frontend...');
    fs.copyFileSync(frontendEnvExamplePath, frontendEnvPath);
  }
}

// Função para instalar dependências
async function installDependencies() {
  console.log('📥 Instalando dependências...\n');
  
  try {
    // Instalar dependências do backend
    await runCommand('npm', ['install'], path.join(__dirname, 'api'), 'Backend');
    
    // Instalar dependências do frontend
    await runCommand('npm', ['install'], path.join(__dirname, 'web'), 'Frontend');
    
    console.log('✅ Todas as dependências foram instaladas!\n');
  } catch (error) {
    console.error('❌ Erro ao instalar dependências:', error.message);
    process.exit(1);
  }
}

// Função para iniciar os serviços
async function startServices() {
  console.log('🚀 Iniciando serviços...\n');
  
  try {
    // Iniciar backend
    const backend = spawn('npm', ['run', 'start:dev'], {
      cwd: path.join(__dirname, 'api'),
      stdio: 'inherit',
      shell: true
    });

    // Aguardar um pouco para o backend inicializar
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Iniciar frontend
    const frontend = spawn('npm', ['run', 'dev'], {
      cwd: path.join(__dirname, 'web'),
      stdio: 'inherit',
      shell: true
    });

    // Configurar handlers para finalização
    process.on('SIGINT', () => {
      console.log('\n🛑 Finalizando serviços...');
      backend.kill();
      frontend.kill();
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      console.log('\n🛑 Finalizando serviços...');
      backend.kill();
      frontend.kill();
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Erro ao iniciar serviços:', error.message);
    process.exit(1);
  }
}

// Função principal
async function main() {
  try {
    // Criar arquivos .env se necessário
    createEnvFiles();
    
    // Verificar se as dependências já estão instaladas
    const fs = require('fs');
    const backendNodeModules = fs.existsSync(path.join(__dirname, 'api', 'node_modules'));
    const frontendNodeModules = fs.existsSync(path.join(__dirname, 'web', 'node_modules'));

    if (!backendNodeModules || !frontendNodeModules) {
      await installDependencies();
    }

    await startServices();
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

main();
